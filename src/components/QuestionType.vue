<template>
    <div class="m-form">
        <template v-if="inputType == 'value' || inputType == 'text'">
            <input class="form-control" type="text" @input="updateLabel($event.target.value)" :value="value"/>
        </template>
        <template v-else-if="inputType == 'open_text'">
            <textarea class="form-control" type="text" @input="updateLabel($event.target.value)" v-model="value"></textarea>
        </template>
    </div>
</template>

<script>
export default {
    props: ["type"],
    data: () => ({
        inputType: "text",
        value: null,
    }),
    model: {
        prop: "modelValue",
        event: "input"
    },
    created() {
        this.initType(this.type);
        this.value = this.$attrs.modelValue;
    },
    methods: {
        initType(type){
            if (type || type != null) {
                this.inputType = type;
            } else {
                this.inputType = "text";
            }
        },
        updateLabel(value = null) {
            if (value != null) {
                this.value = value;
                this.$emit("input", this.value);
            }
        },
    },
    mounted() {
        this.updateLabel();
    },
    watch: {
        $attrs: {
            handler(val) {
                this.value = val.modelValue;
                this.updateLabel();
            },
            deep: true
        },
        $props: {
            handler(val){
                if(val.type){
                    this.initType(val.type);
                }
            },
            deep: true,
        }
    }
};
</script>


<style lang="css" scoped>
    .m-form input, .m-form textarea{
        padding: 5px 10px;
        margin: 10px auto;
    }
</style>