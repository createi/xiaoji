<template>
  <div class="dashboard">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card title="今日销售额" :bordered="false">
          <a-statistic
            :value="25890"
            :precision="2"
            prefix="¥"
            :value-style="{ color: '#3f8600' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="今日订单数" :bordered="false">
          <a-statistic
            :value="128"
            :value-style="{ color: '#1890ff' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="今日新增用户" :bordered="false">
          <a-statistic
            :value="36"
            :value-style="{ color: '#722ed1' }"
          />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card title="待处理退款" :bordered="false">
          <a-statistic
            :value="5"
            :value-style="{ color: '#cf1322' }"
          />
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="16">
        <a-card title="销售趋势" :bordered="false">
          <div style="height: 400px; display: flex; align-items: center; justify-content: center; color: #999;">
            图表区域（待接入 ECharts）
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="快捷操作" :bordered="false">
          <a-space direction="vertical" style="width: 100%">
            <a-button type="primary" block @click="$router.push('/product/add')">
              添加商品
            </a-button>
            <a-button block @click="$router.push('/order/list')">
              查看订单
            </a-button>
            <a-button block @click="$router.push('/user/list')">
              用户管理
            </a-button>
            <a-button block @click="$router.push('/marketing/coupon')">
              优惠券管理
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
</script>
