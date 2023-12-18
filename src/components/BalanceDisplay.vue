<template>
    <div class="balance-display">
      <!-- 显示总余额 -->
      总余额: {{ balance }} 元
    </div>
  </template>
  
  <script>
  export default {
    name: 'BalanceDisplay',
    props: {
      balance: {
        type: Number,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .balance-display {
    /* 这里添加样式 */
  }
  </style>
  