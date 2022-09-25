<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-4 left-section d-flex align-items-center flex-column">
                <div class="w-75">
                    <h2>To Add New Note</h2>
                    <p class="mt-1">Note what you want to save using this <span>Note App Page</span>!!</p>
                </div>
                <form @submit.prevent="handleCreate" class="w-75">
                    <input  type="text" v-model="newNote.title" class="form-control mt-2 mb-3 p-2" placeholder="Note Title">
                    <textarea v-model="newNote.content" placeholder="Note Detail" class="form-control h-50"></textarea>
                    <button type="submit" class="btn1 mt-3">Create note</button>
                    <button @click="logout" class="btn1 mt-2">Logout</button>
                </form>
            </div>
            <div class="col-md-8 right-section">
                <div v-if="!notesLoading">
                    <div class="row ms-0 pt-3">
                        <div v-for="note in notesData.notes" :key="note" class="col-md-3 gx-2 gy-2" draggable="true" @dragstart="startDrag($event, item)">
                            {{notesData.notes.value}}
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">{{ note.title }}</h5>
                                    <p class="card-text mt-3" v-html="convertToHtml(note.content)"></p>
                                    <div class="card-text">
                                        {{ convertToDate(note.created) }}
                                        <div @click="() => deleteNote({id: note.id})" class="mt-3 d-inline">
                                            <img  src="../../public/trash.svg" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useSignOut, useUserId } from '@nhost/vue'
    import { useMutation, useQuery } from '@vue/apollo-composable'
    import { gql } from '@apollo/client/core'
    const router = useRouter()
    const { signOut } = useSignOut()
    const userId = useUserId()
    const newNote = ref({
        title: '',
        content: ''
    })
    const logout = () => {
        signOut()
        router.push('/login')
    }
    const {
        loading: notesLoading, 
        result: notesData, 
        refetch: notesRefetch 
    } = useQuery(gql`
        query ($userId: String!) {
            notes (
                order_by: { created: desc }, 
                where: { user_id: {_eq: $userId} }
            ) {
                id
                title,
                content,
                created
            }
        }
    `, { userId: userId.value })
    const { mutate: deleteNote, onDone: deleteDone } = useMutation(gql`
        mutation ($id: Int!) {
            delete_notes(where: {id: {_eq: $id}}) {affected_rows}
        }
    `)
    deleteDone(() => {
        notesRefetch()
        console.log(notesData);
    })
    const { 
        mutate: createNote, 
        onDone: createDone 
    } = useMutation(gql`
        mutation ($userId: String!, $title: String!, $content: String!) {
            insert_notes_one(object: {user_id: $userId, title: $title, content: $content}) {
                id
            }
        }
    `)
    const handleCreate = () => {
        if (!newNote.value.title || !newNote.value.content) {
            return alert("Please fill in all fields")
        }
        createNote({
            userId: userId.value,
            title: newNote.value.title,
            content: newNote.value.content
        })
    }
    createDone(() => {
        notesRefetch()
        newNote.value = {
            title: '',
            content: ''
        }
    })
    const convertToHtml = (content) => {
        return content.replace(/\n/g, '<br />')
    } 
    const convertToDate = (date) => {
        return new Date(date).toLocaleString()
    }

    function startDrag(event,item){
        console.log(item);
        event.dataTransfer.dropEffect = 'move'
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('itemID', item.id)
    }


</script>

<style scoped>
    
    .left-section{
        height: 100vh;
        color: #fff;
        background: rebeccapurple;
        z-index: 1;
        padding-top: 150px;
    }

    .right-section{
        background-color: #fff;
        overflow-y: scroll;
    }

    .btn1{
        border: none;
        outline: none;
        height: 50px;
        width: 100%;
        background-color: black;
        color: white;
        border-radius: 4px;
        font-weight: bold;
    }

    .btn1:last-child{
        background-color:transparent;
        color: #fff;
        border: 1px solid black;
    }

    .btn1:hover{
        background-color: white;
        border: 1px solid;
        color: black;
    }

    p span{
        font-weight: bold;
    }

    .card{
        background: linear-gradient(rebeccapurple,rgb(56, 55, 55));
        color: white;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
    }
    .card::before{
        content: "";
        position: absolute;
        width: 100px;
        height: 140%;
        background: linear-gradient(#00ccff,#fff);
        animation: animate 4s linear infinite;
    }

    .card::after{
        content: "";
        position: absolute;
        inset: 4px;
        background: rebeccapurple;
    }

    @keyframes animate{
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }

    .card-title,.card-text{
        color: #fff;
            position: relative;
            z-index:10;
    }

    img{
        margin-left: 10px;
        margin-top: -2px;
        background: red;
        width: 20px;
        padding: 3px;
        border-radius: 50%;
        cursor: pointer;
    }

    
    
</style>
