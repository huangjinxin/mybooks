<template>
  <div class="container mt-3">
    <div class="p-3 mb-2 bg-light text-dark">
      <h4 class="text-center">总余额: <span class="text-primary">{{ balance.toFixed(2) }} 元</span></h4>
    </div>
  </div>
</template>
<!-- 其余的 script 和 style 标签保持不变 -->

  
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
  