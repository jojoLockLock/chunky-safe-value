export interface GetSafeValueFn {
  (params: GetSafeValueFnParams): any
}

export interface GetSafeValueFnModel {
  type: string,
  safeValue?: any,
  items?: GetSafeValueFnModel,
  props?: { [propsName: string]: GetSafeValueFnModel },
  required?: boolean
}

export interface GetSafeValueFnParams {
  value: any,
  model: GetSafeValueFnModel,
  onError?: (error: Error) => void,
  paths?: string[]
}

export interface ValidateFn {
  (value: any): boolean
}


const isObject = value => value != null && typeof value === 'object' && Array.isArray(value) === false

const isArray = value => Array.isArray(value)

const isNumber = value => typeof value === 'number' && !isNaN(value)

const isBoolean = value => typeof value === 'boolean'

const isString = value => typeof value === 'string'

const isAny = value => true

const OBJECT = 'Object',
  ARRAY = "Array",
  NUMBER = "Number",
  BOOLEAN = "Boolean",
  STRING = "String",
  ANY = "Any"

const modelDefaultOption = {
  [STRING]: {
    safeValue: "",
    required: false
  },
  [OBJECT]: {
    safeValue: {},
    required: false,
    props: {}
  },
  [ARRAY]: {
    safeValue: [],
    required: false,
    items: {
      type: ANY
    }
  },
  [NUMBER]: {
    safeValue: 0,
    required: false
  },
  [ANY]: {
    safeValue: null,
    required: false,
  },
  [BOOLEAN]: {
    safeValue: false,
    required: true,
  }
}

const registeredValidateFn = {
  [STRING]: isString,
  [OBJECT]: isObject,
  [ARRAY]: isArray,
  [NUMBER]: isNumber,
  [ANY]: isAny
}


const registerValidateFn = (type: string, validateFn: ValidateFn) => {
  if (type in registeredValidateFn) {
    console.warn(`Type:${type} has registered`)
  } else {
    registeredValidateFn[type] = validateFn
  }
}

const is = (model: GetSafeValueFnModel, value) => {
  try {
    if (model.type in registeredValidateFn) {
      return registeredValidateFn[model.type](value)
    }
    return false
  } catch (e) {
    console.error(`is:`, e)
    return false
  }
}

const fillDefaultOptionByModel = (model: GetSafeValueFnModel): GetSafeValueFnModel => {
  try {
    if (model.type in modelDefaultOption) {
      return { ...modelDefaultOption[model.type], ...model }
    }
  } catch (e) {
    console.error("fillDefaultOptionByModel:", e)
    return model
  }
}

const getError = (value, paths: string[], model: GetSafeValueFnModel) => {

  return new Error(`paths:${paths.join(".")},value:${value} should type of ${model.type}`)
}

const defaultErrorHandle = (error) => {
  // console.error(error)
}

const getObjectSafeValue: GetSafeValueFn = (params) => {
  try {
    const { value, model, onError = defaultErrorHandle, paths = ["VALUE"] } = params

    return Object

      .entries(model.props)

      .reduce((objectSafeValue, [propName, propModel]) => {

        const has = propName in value

        //props为required 且 props不存在时
        if (propModel.required && (!has)) {
          onError(getError(value, paths, propModel))
          objectSafeValue[propName] = getSafeValue({
            value: value[propName],
            model: propModel,
            onError,
            paths: [...paths, propName]
          })
        }

        //props存在时
        if (has) {
          objectSafeValue[propName] = getSafeValue({
            value: value[propName],
            model: propModel,
            onError,
            paths: [...paths, propName]
          })
        }

        return objectSafeValue

      }, { ...value })


  } catch (e) {

    console.error(`getObjectSafeValue:`, e)

    return {}
  }
}

const getArraySafeValue: GetSafeValueFn = (params) => {
  try {
    const { value, model, onError = defaultErrorHandle, paths = ["VALUE"] } = params

    return value.map((i, index) => getSafeValue({
      value: i,
      model: model.items,
      onError,
      paths: [...paths, index]
    }))

  } catch (e) {

    console.error(`getObjectSafeValue:`, e)

    return []
  }
}

export const getSafeValue: GetSafeValueFn = (params) => {

  const { value, model, onError = defaultErrorHandle, paths = ["VALUE"] } = params

  const finalModel = fillDefaultOptionByModel(model)

  const safe = is(model, value)

  if (!safe) {
    onError(getError(value, paths, finalModel))
    return finalModel.safeValue
  }

  if (model.type === OBJECT) {
    return getObjectSafeValue({
      value,
      model: finalModel,
      onError,
      paths,
    })
  }

  if (model.type === ARRAY) {
    return getArraySafeValue({
      value,
      model: finalModel,
      onError,
      paths,
    })
  }

  return value
}


export const Type = {
  [OBJECT]: OBJECT,
  [ARRAY]: ARRAY,
  [NUMBER]: NUMBER,
  [BOOLEAN]: BOOLEAN,
  [STRING]: STRING,
  [ANY]: ANY
}

export default {
  Type,
  getSafeValue
}