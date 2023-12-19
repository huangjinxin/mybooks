<template>
  <div class="container mt-3">
    <h3 class="mb-3">添加交易记录</h3>
    <form @submit.prevent="submitTransaction">
      <div class="mb-3">
        <label for="amount" class="form-label">金额:</label>
        <!-- 注意这里我们使用了 formattedAmount 来绑定显示值，并监听了用户的输入事件 -->
        <input type="text" class="form-control" id="amount" :value="formattedAmount" @input="handleInput" placeholder="0.00" required>
      </div>
      <!----- 注意这里我们使用了 formattedType 来绑定显示值，并监听了用户的选择事件 -->
      <div class="mb-3">
        <label for="type" class="form-label">类型:</label>
        <select class="form-select" id="type" v-model="newTransaction.type" required>
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">描述:</label>
        <input type="text" class="form-control" id="description" v-model="newTransaction.description" placeholder="交易描述">
      </div>
      <button type="submit" class="btn btn-primary">提交</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddTransaction',
  data() {
    return {
      // 初始化交易金额为 0（以分为单位）
      transactionAmount: 0,
      newTransaction: {
        id: null,
        // 注意这里不再直接使用 v-model 绑定
        amount: 0, 
        type: 'expense',
        description: ''
      }
    };
  },
  computed: {
    // 格式化金额显示，确保始终有两位小数
    formattedAmount() {
      const valueStr = this.transactionAmount.toString().padStart(3, '0');
      return valueStr.slice(0, -2) + '.' + valueStr.slice(-2);
    },
  },
  methods: {
    handleInput(event) {
      const value = event.target.value.replace(/\D/g, ''); // 移除非数字字符
      this.transactionAmount = Number(value) || 0; // 更新金额（以分为单位）
      // 更新 newTransaction.amount 为以元为单位的值
      this.newTransaction.amount = this.transactionAmount / 100;
    },
    submitTransaction() {
      // 检查表单数据有效性
      if (this.newTransaction.amount > 0 && this.newTransaction.type) {
        // 设置一个唯一的交易ID
        this.newTransaction.id = Date.now();
        // 向父组件发出添加交易的事件，传递新交易对象
        this.$emit('add-transaction', {...this.newTransaction});
        // 重置表单数据
        this.resetForm();
      } else {
        // 如果数据无效，则提示用户
        alert('请输入有效的交易金额和类型。');
      }
    },
    resetForm() {
      // 重置新交易数据
      this.newTransaction.id = null;
      this.transactionAmount = 0; // 重置金额
      this.newTransaction.type = 'expense';
      this.newTransaction.description = '';
    },
  }
};
</script>
