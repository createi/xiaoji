<template>
  <div>
    <PageHeader title="微信菜单" />

    <a-card>
      <a-alert
        message="微信自定义菜单"
        description="配置微信公众号底部自定义菜单，修改后需点击同步到微信按钮生效。"
        type="info"
        show-icon
        style="margin-bottom: 24px"
      />

      <a-row :gutter="24">
        <a-col :span="12">
          <a-card title="菜单编辑" size="small">
            <div v-for="(menu, index) in menus" :key="index" style="margin-bottom: 16px">
              <a-card size="small" :title="`一级菜单 ${index + 1}`">
                <a-form layout="vertical" size="small">
                  <a-form-item label="菜单名称">
                    <a-input v-model:value="menu.name" placeholder="菜单名称（最多8个汉字）" />
                  </a-form-item>
                  <a-form-item label="菜单类型">
                    <a-select v-model:value="menu.type" style="width: 100%">
                      <a-select-option value="view">跳转URL</a-select-option>
                      <a-select-option value="click">点击推事件</a-select-option>
                      <a-select-option value="miniprogram">小程序</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item v-if="menu.type === 'view'" label="链接地址">
                    <a-input v-model:value="menu.url" placeholder="https://" />
                  </a-form-item>
                </a-form>
                <a-button type="link" size="small" @click="removeMenu(index)">删除</a-button>
              </a-card>
            </div>
            <a-button type="dashed" block @click="addMenu" :disabled="menuDisabled">
              + 添加一级菜单
            </a-button>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="预览" size="small">
            <div class="menu-preview">
              <div v-for="(menu, index) in menus" :key="index" class="menu-item">
                {{ menu.name || `菜单${index + 1}` }}
              </div>
              <div v-if="menus.length === 0" class="menu-empty">暂无菜单</div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <div style="margin-top: 16px; text-align: center">
        <a-button type="primary" @click="handleSync">同步到微信</a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const menus = reactive([
  { name: '商城首页', type: 'view', url: 'https://', button: [] },
  { name: '个人中心', type: 'view', url: 'https://', button: [] },
]);

const menuDisabled = computed(() => menus.length >= 3);

function addMenu() {
  menus.push({ name: '', type: 'view', url: '', button: [] });
}

function removeMenu(index: number) {
  menus.splice(index, 1);
}

function handleSync() {
  message.success('菜单同步成功');
}
</script>

<style scoped>
.menu-preview {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 12px;
  min-height: 200px;
  display: flex;
  gap: 8px;
}
.menu-item {
  flex: 1;
  padding: 12px;
  text-align: center;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
}
.menu-item:hover {
  background: #e6f7ff;
}
.menu-empty {
  flex: 1;
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>
