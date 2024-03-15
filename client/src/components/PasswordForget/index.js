// import { sendPasswordResetEmail } from "firebase/auth";
// import React from "react";
// import { getAuth, 
//     createUserWithEmailAndPassword, 
//     signInWithEmailAndPassword, 
//     signOut, 
//     sendPasswordResetEmail, 
//     updatePassword, 
//     getIdToken, 
//     getUserByEmail } from 'firebase/auth';

// function PasswordForget(){
//     const handleSubmit = async(e)=>{
//         const emailVal = e.target.email.vale;
//         sendPasswordResetEmail(sendPasswordResetEmail, emailVal).then(data =>
//             alert("Check your email"))
//     }

//     return(
//         <div className = "App">
//             <h1>ForgetPassword</h1>
//             <form onSubmit ={ (e)=> handleSubmit(e)}>
//                 <input name= "email">
//                     <button>Reset</button>
//                 </input>
//             </form>
//         </div>
//     );
// }

// export default PasswordForget;