interface EnumObject {
  list: { label: string; value: string }[];
  getName(val: string): string;
}

interface Enums {
  [key: string]: EnumObject;
}

const enums: Enums = {
  GENDER_TYPE: {
    list: [
      { label: '男', value: 'MALE' },
      { label: '女', value: 'FEMALE' },
    ],
    getName(val: string): string {
      switch (val) {
        case 'MALE':
          return '男';
        case 'FEMALE':
          return '女';
        default:
          return val;
      }
    },
  },
  STATUS_TYPE: {
    list: [
      { label: '启用', value: 'ENABLE' },
      { label: '停用', value: 'DISABLE' },
    ],
    getName(val: string): string {
      switch (val) {
        case 'ENABLE':
          return '启用';
        case 'DISABLE':
          return '停用';
        default:
          return val;
      }
    },
  },
};

function getEnumName(enumType: string, value: string): string {
  const enumObj = enums[enumType];
  if (!enumObj) {
    // console.error(`没有找到${enumType}枚举`);
    return '';
  }
  return enumObj.getName(value);
}

export { getEnumName };