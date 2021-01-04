import React from 'react';
import PasswordReset from './authentication/PasswordReset'
import axios from 'axios'
function Home(props) {

    
    return (
        <div>
            
             {  
                 JSON.parse(localStorage.getItem("user_info")).active===false?(<PasswordReset></PasswordReset>):(<div>Hi home screen 11</div>)

             }
        </div>
    );
}

export default Home;