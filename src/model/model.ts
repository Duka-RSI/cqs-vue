export const yseNoList =  [
  { id: 1, value: 'Yes' },
  { id: 0, value: 'No' }
] 

export interface SelectTreeModel {
    value: number;
    label: string;
    children?: SelectTreeModel[];
  }
  