<template>
    <div class="transaction-list">
      <h3>交易记录</h3>
      <ul>
        <li v-for="transaction in transactions" :key="transaction.id">
          <span>{{ transaction.date }}</span>
          <span>{{ transaction.type === 'income' ? '收入' : '支出' }}</span>
          <span>{{ transaction.amount.toFixed(2) }}</span>
          <span>{{ transaction.description }}</span>
          <button @click="editTransaction(transaction)">编辑</button>
          <button @click="$emit('delete-transaction', transaction.id)">删除</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TransactionList',
    props: ['transactions'],
    methods: {
        editTransaction(transaction) {
        this.$emit('edit-transaction', transaction);
  }
}
  };
  </script>