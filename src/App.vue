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
          type="text"
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
      isLoading: false,
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
    // 验证交易记录
    validateTransaction(transaction) {
    if (!transaction.amount || isNaN(transaction.amount)) {
      alert('请输入有效的金额');
      return false;
    }
    if (!transaction.type) {
      alert('请选择交易类型');
      return false;
    }
    if (!transaction.description.trim()) {
      alert('请输入交易描述');
      return false;
    }
    return true;
  },

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

  // 从后端API加载交易数据
  loadTransactions() {
      fetch('http://localhost:3000/api/transactions')
        .then(response => response.json())
        .then(data => {
          this.transactions = data;
          this.calculateTotalBalance();
        })
        .catch(error => console.error('Error fetching data:', error));
    },

    // 处理添加交易的事件
    addTransaction(newTransaction) {
      if (this.validateTransaction(newTransaction)) {
        fetch('http://localhost:3000/api/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTransaction),
        })
        .then(response => response.json())
        .then(data => {
          this.transactions.push({ ...newTransaction, id: data.id });
          this.calculateTotalBalance();
          alert('交易添加成功');
        })
        .catch(error => {
          console.error('Error posting data:', error);
          alert('交易添加失败');
        });
      }
    },

    // 删除交易记录的事件处理函数（需要后端API支持）
    deleteTransaction(id) {
      fetch(`http://localhost:3000/api/transaction/${id}`, { method: 'DELETE' })
        .then(() => {
          this.transactions = this.transactions.filter(t => t.id !== id);
          this.calculateTotalBalance();
        })
        .catch(error => {
          console.error('Error deleting data:', error);
          alert('交易删除失败');
        });
    },
  },
};
</script>