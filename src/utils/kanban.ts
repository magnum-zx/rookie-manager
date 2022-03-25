import { useQuery, QueryKey, useMutation } from 'react-query'
import { useHttp } from 'utils/http'
import { Kanban } from 'types/kanban'
import {
  useReorderKanbanConfig,
  useDeleteConfig,
  useAddConfig
} from 'utils/use-optimistic-options'

// 请求看板的数据
export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp()

  return useQuery<Kanban[]>(['kanbans', param], () =>
    client('kanbans', { data: param })
  )
}

export interface SortProps {
  // 要重新排序的 item
  fromId: number
  // 目标 item
  referenceId: number
  // 放在目标item的前还是后
  type: 'before' | 'after'
  fromKanbanId?: number
  toKanbanId?: number
}

// 看板重新排列的数据设置
export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation((params: SortProps) => {
    return client('kanbans/reorder', {
      data: params,
      method: 'POST'
    })
  }, useReorderKanbanConfig(queryKey))
}

// 删除看板
export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp()

  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: 'DELETE'
      }),
    useDeleteConfig(queryKey)
  )
}
// 添加看板
export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation((params: Partial<Kanban>) => {
    return client(`kanbans`, {
      data: params,
      method: 'POST'
    })
  }, useAddConfig(queryKey))
}
