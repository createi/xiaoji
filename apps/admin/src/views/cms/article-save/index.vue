<template>
  <div class="article-save-page">
    <PageHeader :title="isEdit ? '文章编辑' : '文章新建'" />
    <a-card>
      <a-form
        :model="formData"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        layout="vertical"
      >
        <a-form-item label="文章标题" required>
          <a-input v-model:value="formData.title" placeholder="请输入文章标题" />
        </a-form-item>

        <a-form-item label="文章分类" required>
          <a-select v-model:value="formData.cid" placeholder="请选择分类">
            <a-select-option v-for="item in categoryOptions" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="封面图">
          <a-upload
            list-type="picture-card"
            :file-list="fileList"
            :before-upload="handleBeforeUpload"
            @change="handleUploadChange"
          >
            <div v-if="fileList.length < 1">
              <plus-outlined />
              <div style="margin-top: 8px">上传</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="作者">
          <a-input v-model:value="formData.author" placeholder="请输入作者" />
        </a-form-item>

        <a-form-item label="文章内容" required>
          <a-textarea v-model:value="formData.content" :rows="10" placeholder="请输入文章内容" />
        </a-form-item>

        <a-form-item label="状态">
          <a-radio-group v-model:value="formData.status">
            <a-radio :value="0">草稿</a-radio>
            <a-radio :value="1">发布</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="排序">
          <a-input-number v-model:value="formData.sort" :min="0" :max="9999" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
          <a-button type="primary" :loading="saving" @click="handleSave">保存</a-button>
          <a-button style="margin-left: 12px" @click="handleCancel">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import PageHeader from '@/components/PageHeader/index.vue'
import { getArticleDetail, createArticle, updateArticle } from '@/api/cms'

const route = useRoute()
const router = useRouter()

const articleId = computed(() => route.params.id ? Number(route.params.id) : 0)
const isEdit = computed(() => articleId.value > 0)

const saving = ref(false)
const fileList = ref<any[]>([])
const categoryOptions = ref<any[]>([])

const formData = reactive({
  title: '',
  cid: undefined as number | undefined,
  image_input: '',
  author: '',
  content: '',
  status: 0,
  sort: 0,
})

function handleBeforeUpload() {
  return false
}

function handleUploadChange({ fileList: newFileList }: any) {
  fileList.value = newFileList
  // 如果有上传成功的文件，取第一个的url
  if (newFileList.length > 0 && newFileList[0].status === 'done' && newFileList[0].response) {
    formData.image_input = newFileList[0].response.data.url
  }
}

async function fetchDetail() {
  if (!articleId.value) return
  try {
    const res = await getArticleDetail(articleId.value)
    const data = res.data || {}
    formData.title = data.title || ''
    formData.cid = data.cid
    formData.image_input = data.image_input || ''
    formData.author = data.author || ''
    formData.content = data.content || ''
    formData.status = data.status || 0
    formData.sort = data.sort || 0
    if (data.image_input) {
      fileList.value = [
        {
          uid: '-1',
          name: 'cover.png',
          status: 'done',
          url: data.image_input,
        },
      ]
    }
  } catch {
    // silent
  }
}

async function handleSave() {
  if (!formData.title) {
    message.warning('请输入文章标题')
    return
  }
  if (!formData.content) {
    message.warning('请输入文章内容')
    return
  }
  saving.value = true
  try {
    if (isEdit.value) {
      await updateArticle(articleId.value, { ...formData })
    } else {
      await createArticle({ ...formData })
    }
    message.success('保存成功')
    router.back()
  } catch {
    // silent
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  router.back()
}

onMounted(fetchDetail)
</script>

<style scoped lang="scss">
.article-save-page {
  padding: 16px;
}
</style>
