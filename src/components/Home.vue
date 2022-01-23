<template>
    <div class="container my-3">
        <div class="question-paper">
            <strong>{{ assessment.title }}</strong>
            <br>
            <small>{{ assessment.created_at }}</small>
        </div>
        <div class="ass-section" v-for="section, si in assessment.sections" :key="`section_${si}`">
            <div class="section-title">
                <div class="left-side">
                    Section: <span>#{{ section.section_title }}</span>
                </div>
                <div class="right-side">
                    <button @click="sectionEditOption(section, si)" class="btn btn-sm btn-primary">Edit</button>
                </div>
            </div>
            <div class="section-questions">
                <div class="question-item" v-for="question, qi in section.questions" :key="`question-item-${qi}`">
                    <div class="question-title">
                        <span class="question-no">{{ qi+1 }}</span>
                        {{ question.instructions }}
                    </div>
                    <div class="question-data">
                        <div class="q-multiple" v-if="question.type == 'multiple'" >
                            <div class="q-opt" v-for="qop, qpi in question.options" :key="`quetion-opt-${qpi}`">
                                <span class="question-ans-no" @click="setNewAnswer(qop, qpi, qi, si)" :active="question.answer && qpi+1 == question.answerValue" :answered="qpi+1 == question.answer" :type="question.type">{{ qpi+1 }}</span>
                                {{ qop }}
                            </div>
                        </div>
                        <div class="q-value-part" v-else>
                            <QuestionType :type="question.type" v-model="question.answer"/>
                        </div>
                    </div>
                    <div class="question-answer" v-if="question.answer">
                        Correct Answer is: <strong>{{ question.answerValue }}</strong>
                    </div>
                    <div class="question-answer" v-if="question.answer">
                        Your Answer is: <strong>{{ question.answer }}</strong>
                    </div>
                    <div class="question-edit">
                        <button @click="questionEditOption(si, qi, question)" class="btn btn-info btn-sm">Edit question</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="ass-submit">
            <button @click="submitQuestions" class="btn btn-primary"> + Submit Question</button>
        </div>

        <div class="popup-box" v-if="sectionEdit">
            <div class="edit-box">
                <div class="my-2 text-left">
                    <strong>Update Section Title</strong>
                </div>
                <input type="text" v-model="sectionEditData.title" class="form-control" placeholder="Enter section title">
                <br>
                <div class="popoupsubmit">
                    <button @click="sectionEdit = false" class="btn btn-sm btn-danger">Cancel</button>
                    <button @click="saveSection" class="btn btn-sm btn-primary">Save</button>
                </div>
            </div>
        </div>
        
        <div class="popup-box" v-if="questionEdit">
            <div class="edit-box">
                <div class="my-2 text-left">
                    <strong>Update Question Section</strong>
                </div>
                <label for="">Instructions</label>
                <input type="text" v-model="questionEditData.instruction" class="form-control" placeholder="Enter question title">
                <label for="">Answer</label>
                <input type="text" v-model="questionEditData.answer" class="form-control" placeholder="Enter qestion answer">
                <label for="">Type</label>
                <select class="form-control" v-model="questionEditData.type">
                    <option v-for="chooseType, ik in ['multiple', 'open_text', 'value']" :key="ik + 'choosetype'" :value="chooseType">{{ chooseType }}</option>
                </select>
                <br>
                <div class="popoupsubmit">
                    <button @click="questionEdit = false" class="btn btn-sm btn-danger">Cancel</button>
                    <button @click="saveQuestion" class="btn btn-sm btn-primary">Save</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import QuestionType from '@/components/QuestionType';
export default {
    components: {
        QuestionType
    },
    name: 'home-view',
    data: () => ({
        sectionEdit: false,
        questionEdit: false,
        assessment: [],
        sectionEditData: {
            title: null,
            index: null,
        },
        questionEditData: {
            instruction: null,
            answer: null,
            type: null,
            si: null,
            qIndex: null
        }
    }),
    created(){
        this.laodAssessment(true);
    },
    methods: {
        laodAssessment(hideAnswer = false){
            this.$cf.apiGet('https://canditech-assets-u.s3.amazonaws.com/questions_and_tasks_assets/Canditech/assessment_data.json').then((res) => {
                this.assessment = res;
                if(hideAnswer == true){
                    this.assessment.sections.forEach((ele) => {
                        let question  = ele.questions;
                        question.map((qEle) => {
                            qEle.answerValue = qEle.answer;
                            qEle.answer = null;
                        });
                    });
                }
                // console.log(this.assessment.sections);
            }).catch(err => {
                console.log(err);
            });
        },
        setNewAnswer(item, qIndex, qsIndex, sectionIndex){
            let getSection = this.assessment.sections[sectionIndex];
            if(getSection){
                let question = getSection.questions[qsIndex];
                if(question){
                    if(question.answer == null){
                        question.answer = qIndex+1;
                    }else{
                        console.log("This question is already checked");
                    }
                }
            }
        },
        submitQuestions(){
            let data = this.assessment;
            let url = 'some_url';
            this.$cf.apiPost(url, { 'assessment_data': data }).then((res) => {
                console.log(res);
                console.log("success return after backend");
            }).catch(err => {
                console.log(err);
            });
        },
        sectionEditOption(section, index){
            this.sectionEdit = true;
            this.sectionEditData.title = section.section_title;
            this.sectionEditData.index = index;
        },
        questionEditOption(sectionIndex, qIndex, question){
            this.questionEdit = true;
            this.questionEditData.instruction = question.instructions;
            this.questionEditData.answer = question.answerValue;
            this.questionEditData.type = question.type;
            this.questionEditData.si = sectionIndex;
            this.questionEditData.qIndex = qIndex;
        },
        saveSection(){
            this.sectionEdit = false;
            let data = this.sectionEditData;
            this.assessment.sections[data.index].section_title = data.title;

            // For api calling
            // let url = 'some_url';
            // this.$cf.apiPost(url, { 'edit_data': data }).then((res) => {
            //     console.log(res);
            //     console.log("success return after backend");
            // }).catch(err => {
            //     console.log(err);
            // });
        },
        saveQuestion(){
            this.questionEdit = false;
            let data = this.questionEditData;
            let questionData = this.assessment.sections[data.si];
            let question = questionData.questions[data.qIndex];
            question.instructions = data.instruction;
            question.answerValue = data.answer;
            question.type = data.type;

            // for api calling
            // let url = 'some_url';
            // this.$cf.apiPost(url, { 'edit_data': data }).then((res) => {
            //     console.log(res);
            //     console.log("success return after backend");
            // }).catch(err => {
            //     console.log(err);
            // });
        }

    }
}
</script>

<style lang="css" scoped>
    .question-paper{
        margin: 20px auto;
        font-size: 25px;
    }
    .question-paper strong{
        color: #2f3f4f;
    }
    .section-title{
        font-weight: bold;
        padding-bottom: 10px;
        border-bottom: thin solid #aaa;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .section-title span{
        color: #1870C9;
    }
    .ass-section{
        margin-bottom: 20px;
    }
    span.question-no {
        display: inline-block;
        padding: 2px 12px;
        background: #1b6fc9;
        border-radius: 0.25rem;
        color: #fff;
        margin-right: 10px;
    }
    .question-title{
        margin-bottom: 10px;
    }
    .question-item {
        margin-bottom: 20px;
    }
    span.question-ans-no {
        height: 30px;
        width: 30px;
        display: inline-block;
        border: 2px solid #555;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
    }
    span.question-ans-no[active]{
        border: 2px solid #20b35c;
        background: #20b35c;
        color: #fff;
    }
    span.question-ans-no[answered]{
        border: 2px solid #CA6F0E!important;
        background: #CA6F0E!important;
        color: #fff;
    }
    .question-answer strong{
        color: #20b35c;
    }
    .popoupsubmit{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .popup-box{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.15);
        backdrop-filter: blur(5px);
    }
    .popup-box .edit-box{
        background: #fff;
        max-width: 600px;
        margin: auto;
        padding: 25px;
        border-radius: 0.25rem;
        margin-top: 50px;
    }
</style>