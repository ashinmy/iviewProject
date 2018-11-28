<!--渠道管理-->
<template>
    <div>
        <Row class="padding-5-percent">
            <Col>
                <Card>
                    <h4 slot="title">
                        <i-input v-model="searchQuery.searchCode"  placeholder="请输入支付渠道代码" @on-enter="handleSearch" style="width: 200px"></i-input>&nbsp;&nbsp;
                        <i-button type="primary" icon="ios-search" @click="handleSearch" >搜索</i-button>&nbsp;&nbsp;
                        <i-button type="primary" icon="ios-add" @click="handleCreate">添加</i-button>
                    </h4>
                </Card>
                <Card>
                    <Table :data="tableData" :columns="columns" :loading="isLoading"  border ></Table>
                </Card>
                <modal v-model="showModal" :title="textMap[dialogStatus]" :draggable="isDraggable">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                        <FormItem label="代码" prop="code">
                            <i-input v-model="formValidate.code" placeholder="请输入支付渠道代码"></i-input>
                        </FormItem>
                        <FormItem label="支付渠道名称" prop="channelname">
                            <i-input v-model="formValidate.channelname" placeholder="请输入支付渠道名称"></i-input>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button v-if="dialogStatus=='create'" type='primary' @click="handleSubmit">创建</Button>
                        <Button v-else type="primary" @click="handleEdit">确认</Button>
                        <Button type="primary" size="large" @click="handleReset">取消</Button>
                    </div>
                </modal>
            </Col>
        </Row>
    </div>

</template>

<script>
    export default {
        name: 'channel',
        data () {
            return {
                showModal: false,
                isLoading: true,
                isDraggable:true,
                searchQuery: {
                    searchCode: ''
                },
                formValidate: {
                    id: '',
                    code: '',
                    channelname: ''
                },
                ruleValidate: {
                    channelname: [
                        {required: true, message: '支付渠道名不能为空', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '代码不能为空', trigger: 'blur'}
                    ]
                },
                dialogStatus: '',
                textMap: {
                    edit: '编辑',
                    create: '添加支付渠道'
                },
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '代码',
                        key: 'code',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '支付渠道',
                        align: 'center',
                        key: 'channelname'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 200,
                        key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleUpdate(params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Poptip', {
                                    props: {
                                        confirm: true,
                                        title: '您确定要删除这条数据吗?',
                                        transfer: true
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.handleDelete(params.row)
                                        }
                                    }
                                }, [
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'error',
                                            placement: 'top'
                                        }
                                    }, '删除')
                                ])
                            ])
                        }
                    }
                ],
                tableData: [],
                thisTableData: []
            }
        },
        methods: {
            getData () {
                this.request('http://localhost:38080/manage/pay/getPayChannel')
                    .then((data) => {
                        if (data.status === 200) {
                            console.log(data.obj);
                            this.tableData = data.obj
                            this.thisTableData = this.tableData
                            this.isLoading = false
                        }
                    }).catch((response) => {
                        this.$Modal.warning({
                            title: '警告',
                            content: '数据请求超时'
                        })
                    })
            },
            search (data, argumentObj) {
                let res = data
                let dataClone = data
                for (let argu in argumentObj) {
                    if (argumentObj[argu].length > 0) {
                        res = dataClone.filter(d => {
                            return d[argu].indexOf(argumentObj[argu]) > -1
                        })
                        dataClone = res
                    }
                }
                return res
            },
            handleSearch () {
                this.tableData = this.thisTableData
                this.tableData = this.search(this.tableData, {code: this.searchQuery.searchCode})
            },
            handleDelete (currentRow) {
                this.request('http://localhost:38080/manage/pay/deletePayChannel', Object.assign({}, currentRow))
                    .then((data) => {
                        if (data.status === 200) {
                            this.getData()
                            this.$Message.success('删除了第' + (currentRow._index + 1) + '行数据')
                        }
                    }).catch((response) => {
                        this.$Modal.warning({
                            title: '警告',
                            content: '操作请求超时'
                        })
                    })
            },
            handleUpdate (currentRow) {
                this.$refs['formValidate'].resetFields()
                this.dialogStatus = 'edit'
                this.formValidate = Object.assign({}, currentRow)
                this.showModal = true
            },
            handleCreate () {
                this.$refs['formValidate'].resetFields()
                this.dialogStatus = 'create'
                this.showModal = true
            },
            handleSubmit () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.request('http://localhost:38080/manage/pay/addPayChannel', this.formValidate)
                            .then((data) => {
                                if (data.status === 200) {
                                    this.$Message.success(data.msg)
                                    this.showModal = false
                                    this.getData()
                                }
                            }).catch((response) => {
                                this.$Modal.warning({
                                    title: '警告',
                                    content: '操作请求超时'
                                })
                            })
                    }
                })
            },
            handleReset () {
                this.$refs['formValidate'].resetFields()
                this.showModal = false
            },
            handleEdit () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.request('http://localhost:38080/manage/pay/editPayChannel', this.formValidate)
                            .then((data) => {
                                if (data.status === 200) {
                                    this.$Message.success(data.msg)
                                    this.showModal = false
                                    this.getData()
                                }
                            }).catch((response) => {
                                this.$Modal.warning({
                                    title: '警告',
                                    content: '操作请求超时'
                                })
                            })
                    }
                })
            }
        },
        mounted () {
            this.getData()
        }
    }
</script>

<style lang="less">
    @import '../../../styles/common.less';
</style>
