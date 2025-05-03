function validateRequired(value: any) {
  if (!value) {
    return 'This field is required'
  }

  return true;
}

export { validateRequired }