<template>
  <!-- 应用的根组件 -->
  <div id="app">
    <balance-display :balance="totalBalance"></balance-display>
    <add-transaction @add-transaction="addTransaction"></add-transaction>
    <transaction-list
    :transactions="transactions"
    @edit-transaction="editTransaction"
    @delete-transaction="deleteTransaction"
  ></transaction-list>
  </div>

  <!-- ...其他代码... -->

<!-- 编辑交易模态框 -->
<!-- 编辑交易记录的模态框 -->
  <b-modal
    id="edit-transaction-modal"
    title="编辑交易记录"
    v-model="showEditModal"
    @hide="resetCurrentTransaction"
  >
    <!-- 阻止表单默认提交行为，并在提交时调用 updateTransaction 方法 -->
    <form @submit.prevent="updateTransaction">
      <!-- 金额输入框 -->
      <div class="mb-3">
        <label for="edit-amount" class="form-label">金额</label>
        <input
          type="number"
          class="form-control"
          id="edit-amount"
          v-model.number="currentTransaction.amount"
          required
        >
      </div>
      <!-- 类型选择框 -->
      <div class="mb-3">
        <label for="edit-type" class="form-label">类型</label>
        <select
          class="form-select"
          id="edit-type"
          v-model="currentTransaction.type"
          required
        >
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
      </div>
      <!-- 描述输入框 -->
      <div class="mb-3">
        <label for="edit-description" class="form-label">描述</label>
        <input
          type="text"
          class="form-control"
          id="edit-description"
          v-model="currentTransaction.description"
        >
      </div>
      <!-- 提交按钮 -->
      <button type="submit" class="btn btn-primary">更新</button>
    </form>
  </b-modal>

<!-- ...其他代码... -->

</template>


<script>
// 导入子组件
import BalanceDisplay from './components/BalanceDisplay.vue';
import TransactionList from './components/TransactionList.vue';
import AddTransaction from './components/AddTransaction.vue';

export default {
  name: 'App',
  components: {
    // 注册子组件以在模板中使用
    BalanceDisplay,
    TransactionList,
    AddTransaction
  },
  data() {
    return {
      totalBalance: 0,
      transactions: [],
      // 初始化为具有默认值的对象
      currentTransaction: {
        id: null,
        amount: 0,
        type: 'income', // 或其他合理的默认值
        description: ''
      },
      showEditModal: false,
    };
  },
  mounted() {
    // 当组件挂载到DOM上后，从本地存储加载交易数据
    this.loadTransactions();
  },
  methods: {
    // 更新交易记录
    updateTransaction() {
    // 检查 currentTransaction 是否存在并且有一个有效的 id
    if (this.currentTransaction && this.currentTransaction.id !== null) {
      // 找到当前交易记录在数组中的位置
      const index = this.transactions.findIndex(t => t.id === this.currentTransaction.id);
      if (index !== -1) {
        // 更新交易记录
        this.transactions.splice(index, 1, this.currentTransaction);
        // 重新计算总余额
        this.calculateTotalBalance();
        // 保存到本地存储
        this.saveTransactions();
        // 重置当前交易记录并关闭模态框
        this.resetCurrentTransaction();
        this.showEditModal = false;
      }
    }
  },
    // 计算总余额
  calculateTotalBalance() {
    // 计算总余额的逻辑
    this.totalBalance = this.transactions.reduce(
      (acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount,
      0
    );
  },
  // 重置当前交易记录
  resetCurrentTransaction() {
    // 重置 currentTransaction
    this.currentTransaction = { id: null, amount: 0, type: 'income', description: '' };
  },
  // 编辑交易记录的事件处理函数
  editTransaction(transactionToEdit) {
    this.currentTransaction = { ...transactionToEdit };
    this.showEditModal = true; // 当点击编辑按钮时设置为 true
  },
  // 控制模态框的显示或隐藏
  toggleModal(show) {
    // 控制模态框的显示或隐藏
    this.showEditModal = show;
  },
  // 处理添加交易的事件
  addTransaction(newTransaction) {
    // 生成一个新的交易记录对象
    const transaction = {
      ...newTransaction,
      date: new Date().toISOString().slice(0, 10) // 添加当前日期
    };
    // 将新交易添加到交易记录数组
    this.transactions.push(transaction);
    // 根据交易类型更新总余额
    if (transaction.type === 'income') {
      // 如果是收入，增加总余额
      this.totalBalance += transaction.amount;
    } else {
      // 如果是支出，减少总余额
      this.totalBalance -= transaction.amount;
    }
    // 确保在数据更改后保存数据
    this.saveTransactions();
  },

  // 删除交易记录的事件处理函数
  deleteTransaction(id) {
    // 过滤掉要删除的交易记录
    this.transactions = this.transactions.filter(t => t.id !== id);
    // 重新计算总余额
    this.totalBalance = this.transactions.reduce(
      (acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount,
      0
    );
    // 确保在数据更改后保存数据
    this.saveTransactions();
  },
  // 保存交易数据到本地存储
  saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  },

  // 从本地存储加载交易数据
  loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions'));
    if (transactions) {
      this.transactions = transactions;
      // 重新计算总余额
      this.totalBalance = this.transactions.reduce(
        (acc, transaction) => {
          return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0);
    }
  },
}
};
</script>

<style>
/* 这里添加全局样式 */
#app {
  text-align: center;
}
</style>
