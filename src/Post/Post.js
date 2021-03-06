import React , {useEffect , useState}from 'react'
import './Post.css'
import {db} from '../firebase'
import { Avatar } from '@material-ui/core';
import firebase from 'firebase'

function Post({postId, username ,user, caption , imageUrl}) {
    const [comments, setComments] = useState([])
    const [comment, setComment ] = useState('')

   
    useEffect(() => {
        let unsubscribe;
        if(postId){
          unsubscribe = db
          .collection('posts')
          .doc(postId)
          .collection('comments')
          .orderBy('timestamp', 'desc')
          .onSnapshot((snapshot) => {
            setComments(snapshot.docs.map(doc => doc.data()))
          })
        }
    
        return() =>{
          unsubscribe()
        }
      }, [postId])
    

      const postComment = (event) =>{

        if(user){
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp(), 
        })
        setComment('')}

        else{
            alert('Please Signin to Comment')
        }
    }

    
    return (
        <div className='post'>
            <div className='post__header'>
            <Avatar
                className='post__avatar'
                alt='ad'
                src=''
            />
            <h3> {username}</h3>
            </div>
            <img
                className='post__image'
                src={imageUrl}

                />

            <h4 className='post__text'> <strong>{username} </strong>{caption}</h4>
            <div className='post__comments'>

                {comments.map((comment) =>(
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}


            </div>
            
            
            <form className='post__commentBox'>
                <input
                    className='post__input'
                    type='text'
                    placeholder='Comment'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    className='post__button'
                    disabled={!comment}
                    type='submit'
                    onClick={postComment}
                >
                    Send 
                </button>
            </form>
        </div>
    )
}

export default Post
