<template>
    <div class="add-transaction">
      <h3>添加交易记录</h3>
      <form @submit.prevent="submitTransaction">
        <div>
          <label for="amount">金额:</label>
          <input type="number" id="amount" v-model.number="newTransaction.amount" placeholder="请输入金额" required>
        </div>
        <div>
          <label for="type">类型:</label>
          <select id="type" v-model="newTransaction.type" required>
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
        </div>
        <div>
          <label for="description">描述:</label>
          <input type="text" id="description" v-model="newTransaction.description" placeholder="交易描述">
        </div>
        <button type="submit">提交</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AddTransaction',
    data() {
      return {
        newTransaction: {
          id: null,
          amount: 0,
          type: 'expense', // 默认为支出
          description: ''
        }
      };
    },
    methods: {
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
        this.newTransaction.amount = 0;
        this.newTransaction.type = 'expense';
        this.newTransaction.description = '';
      }
    }
  };
  </script>
  
  <style scoped>

  </style>
  