<template>
  <div>
    <PageHeader title="自动回复" />

    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="follow" tab="关注回复">
        <a-card>
          <a-form layout="vertical" style="max-width: 600px">
            <a-form-item label="回复类型">
              <a-radio-group v-model:value="followReply.type">
                <a-radio value="text">文字</a-radio>
                <a-radio value="image">图片</a-radio>
                <a-radio value="news">图文</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="followReply.type === 'text'" label="回复内容">
              <a-textarea v-model:value="followReply.content" :rows="4" placeholder="输入回复文字内容" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSaveFollow">保存</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="keyword" tab="关键词回复">
        <a-card>
          <template #extra>
            <a-button type="primary" @click="handleAddKeyword">添加关键词</a-button>
          </template>
          <a-table
            :columns="keywordColumns"
            :data-source="keywordList"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-switch v-model:checked="record.status" size="small" />
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a @click="handleEditKeyword(record)">编辑</a>
                  <a-popconfirm title="确认删除？" @confirm="handleDeleteKeyword(record.id)">
                    <a style="color: #f5222d">删除</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import PageHeader from '@/components/PageHeader/index.vue';

const activeTab = ref('follow');

const followReply = reactive({
  type: 'text',
  content: '欢迎关注我们的公众号！',
});

const keywordList = ref([
  { id: 1, keyword: '签到', matchType: 'exact', replyType: 'text', content: '请在小程序内签到', status: true },
  { id: 2, keyword: '客服', matchType: 'exact', replyType: 'text', content: '请输入您的问题，我们将尽快回复', status: true },
]);

const keywordColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
  { title: '关键词', dataIndex: 'keyword', key: 'keyword', width: 120 },
  { title: '匹配方式', dataIndex: 'matchType', key: 'matchType', width: 100 },
  { title: '回复类型', dataIndex: 'replyType', key: 'replyType', width: 100 },
  { title: '回复内容', dataIndex: 'content', key: 'content', ellipsis: true },
  { title: '状态', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
];

function handleSaveFollow() {
  message.success('关注回复保存成功');
}

function handleAddKeyword() {
  message.info('添加关键词功能开发中');
}

function handleEditKeyword(_record: any) {
  message.info('编辑功能开发中');
}

function handleDeleteKeyword(_id: number) {
  message.success('删除成功');
}
</script>
