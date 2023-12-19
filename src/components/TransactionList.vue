<template>
  <div class="container mt-3">
    <h3 class="mb-3">交易记录</h3>
    <ul class="list-group">
      <!-- 使用 v-for 循环你的交易记录 -->
      <li class="list-group-item" v-for="transaction in transactions" :key="transaction.id">
        <div class="d-flex justify-content-between">
          <!-- 日期和金额 -->
          <div class="me-3">
            <span class="font-weight-bold">{{ transaction.date }}</span>
            <span class="badge bg-success ms-2" v-if="transaction.type === 'income'">收入</span>
            <span class="badge bg-danger ms-2" v-else>支出</span>
          </div>
          <!-- 金额 -->
          <div class="me-3">
            <span>{{ transaction.amount.toFixed(2) }} 元</span>
          </div>
          <!-- 描述 -->
          <div class="flex-grow-1 text-center">
          <span>{{ transaction.description }}</span>
        </div>
          <!-- 编辑和删除按钮 -->
          <div>
            <button class="btn btn-secondary me-2" @click="editTransaction(transaction)">编辑</button>
            <button class="btn btn-danger" @click="$emit('delete-transaction', transaction.id)">删除</button>
          </div>
        </div>
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
