import getSafeValue, { Type, GetSafeValueFnModel } from '../index'
import * as chai from 'chai'

const { expect } = chai

describe("utils/tools/getSafeValue", () => {

  it("ModelType Number,diff value input,default example output test", () => {

    const model = {
      type: Type.Number
    }

    expect(getSafeValue({
      value: 111,
      model,
    })).to.be.equal(111)

    expect(getSafeValue({
      value: null,
      model,
    })).to.be.equal(0)

    expect(getSafeValue({
      value: [],
      model,
    })).to.be.equal(0)

    expect(getSafeValue({
      value: {},
      model,
    })).to.be.equal(0)

    expect(getSafeValue({
      value: "string",
      model,
    })).to.be.equal(0)


  })

  it("ModelType Number,example option test", () => {

    expect(getSafeValue({
      value: "string",
      model: {
        type: Type.Number,
        safeValue: 80
      },
    })).to.be.equal(80)


  })

  it("ModelType String,diff value input,default example output test", () => {

    const model = {
      type: Type.String
    }

    expect(getSafeValue({
      value: "this is string",
      model,
    })).to.be.equal("this is string")

    expect(getSafeValue({
      value: null,
      model,
    })).to.be.equal("")

    expect(getSafeValue({
      value: [],
      model,
    })).to.be.equal("")

    expect(getSafeValue({
      value: String("String"),
      model,
    })).to.be.equal("String")

    expect(getSafeValue({
      value: {},
      model,
    })).to.be.equal("")

    expect(getSafeValue({
      value: 1,
      model,
    })).to.be.equal("")

  })

  it("ModelType String,example option test", () => {

    expect(getSafeValue({
      value: {},
      model: {
        type: Type.String,
        safeValue: "exampleString"
      },
    })).to.be.equal("exampleString")


  })

  it("ModelType Object,diff value input,default example output test", () => {

    const model = {
      type: Type.Object
    }

    expect(getSafeValue({
      value: { age: 13, name: "myName" },
      model,
    })).to.be.deep.equal({
      age: 13,
      name: "myName"
    })

    expect(getSafeValue({
      value: null,
      model,
    })).to.be.deep.equal({})

    expect(getSafeValue({
      value: 123,
      model,
    })).to.be.deep.equal({})

    expect(getSafeValue({
      value: "string",
      model,
    })).to.be.deep.equal({})

    expect(getSafeValue({
      value: [],
      model,
    })).to.be.deep.equal({})

  })

  it("ModelType Object,example option test", () => {

    expect(getSafeValue({
      value: null,
      model: {
        type: Type.Object,
        safeValue: {
          age: 13,
          name: "myName"
        }
      },
    })).to.be.deep.equal({
      age: 13,
      name: "myName"
    })

  })

  it("ModelType Object,simple props model test", () => {

    const model = {
      type: Type.Object,
      props: {
        name: {
          type: Type.String,
        },
        age: {
          type: Type.Number
        },
        records: {
          type: Type.Array
        },
        limit: {
          type: Type.Object
        }
      }
    }

    expect(getSafeValue({
      value: {
        name: "myName",
        age: 13,
        records: [
          {
            age: 13,
            name: "friend1",
          },
          {
            age: 13,
            name: "friend2",
          },
          {
            age: 13,
            name: "friend3",
          }
        ],
        limit: {
          fn1: 1,
          fn2: 0
        }
      },
      model,
    })).to.be.deep.equal({
      name: "myName",
      age: 13,
      records: [
        {
          age: 13,
          name: "friend1",
        },
        {
          age: 13,
          name: "friend2",
        },
        {
          age: 13,
          name: "friend3",
        }
      ],
      limit: {
        fn1: 1,
        fn2: 0
      }
    })

    expect(getSafeValue({
      value: {
        name: 123,
        age: null,
        records: {},
        limit: []
      },
      model,
    })).to.be.deep.equal({
      name: "",
      age: 0,
      records: [],
      limit: {}
    })

  })

  it("ModelType Object,nest props model test", () => {

    const model: GetSafeValueFnModel = {
      type: Type.Object,
      props: {
        records: {
          type: Type.Array,
          items: {
            type: Type.Object,
            props: {
              age: {
                type: Type.Number
              },
              name: {
                type: Type.String
              }
            },
          }
        },
        limit: {
          type: Type.Object,
          props: {
            fn1: {
              type: Type.Number,
            },
            fn2: {
              type: Type.Number
            }

          }
        }
      }
    }

    expect(getSafeValue({
      value: {
        records: [
          {
            age: null,
            name: "friend1",
          },
          {
            age: 13,
            name: {},
          },
          {
            age: 13,
            name: "friend3",
          }
        ],
        limit: {
          fn1: {},
          fn2: 0
        }
      },
      model,
    })).to.be.deep.equal({
      records: [
        {
          age: 0,
          name: "friend1",
        },
        {
          age: 13,
          name: "",
        },
        {
          age: 13,
          name: "friend3",
        }
      ],
      limit: {
        fn1: 0,
        fn2: 0
      }
    })
  })

  it("ModelType Object,required props test", () => {

    const model: GetSafeValueFnModel = {
      type: Type.Object,
      props: {
        name: {
          type: Type.String,
          required: true
        },
        records: {
          type: Type.Array,
          required: false
        }
      }
    }

    expect(getSafeValue({
      value: {
        age: 13,
        otherProps: []
      },
      model,
    })).to.be.deep.equal({
      age: 13,
      name: "",
      otherProps: []
    })


  })

  it("ModelType Array,diff value input,default example output test", () => {

    const model = {
      type: Type.Array
    }

    expect(getSafeValue({
      value: [{ age: 13, name: "name" }],
      model,
    })).to.be.deep.equal([{ age: 13, name: "name" }])

    expect(getSafeValue({
      value: null,
      model,
    })).to.be.deep.equal([])

    expect(getSafeValue({
      value: 123,
      model,
    })).to.be.deep.equal([])

    expect(getSafeValue({
      value: {},
      model,
    })).to.be.deep.equal([])

    expect(getSafeValue({
      value: "string",
      model,
    })).to.be.deep.equal([])
  })
})