//get  select fields for different entities
export function getSelectFields(entityType: string): string[] {
  const fields = {
    users: ['id', 'email', 'name', 'role'],
    markets: ['id', 'name', 'location', 'status'],
    // Add other entities...
  };
  return fields[entityType] || ['id']; // Default to only ID if not specified
}

//get difference between two objects  old and new  data
export function getObjectDiff(oldObj: any, newObj: any) {
  if (!oldObj || !newObj) return { oldValues: oldObj, newValues: newObj };

  const changedOldValues = {};
  const changedNewValues = {};

  Object.keys(newObj).forEach((key) => {
    if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
      changedOldValues[key] = oldObj[key];
      changedNewValues[key] = newObj[key];
    }
  });

  return {
    oldValues: Object.keys(changedOldValues).length ? changedOldValues : null,
    newValues: Object.keys(changedNewValues).length ? changedNewValues : null,
  };
}
  
