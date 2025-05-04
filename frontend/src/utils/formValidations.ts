function validateRequired(value: any) {
  if (!value) {
    return 'This field is required'
  }

  return true;
}

function validatePassword(value: any) {
  if (!value) {
    return 'This field is required'
  }

  if (value.length < 8) {
    return 'Password must be at least 8 characters'
  }

  return true;
}

export { validateRequired, validatePassword }