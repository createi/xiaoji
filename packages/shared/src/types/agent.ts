// 分销等级
export interface AgentLevel {
  id: number;
  name: string;
  image: string;
  one_brokerage: number;
  two_brokerage: number;
  sort: number;
  status: number;
  add_time: number;
}

// 分销申请
export interface DivisionAgentApply {
  id: number;
  uid: number;
  name: string;
  phone: string;
  level_id: number;
  status: number;
  add_time: number;
}

// 推广申请
export interface SpreadApply {
  id: number;
  uid: number;
  status: number;
  add_time: number;
}
