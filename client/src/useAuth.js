import { useState, useEffect } from 'react'
import  axios from 'axios';

function useAuth(code) {

    const [accessToken , setAccessToken] = useState();
    const [refreshToken , setRefreshToken] = useState();
    const [expiresIn , setExpiresIn] = useState();

      useEffect(() => {
        axios
          .post("http://localhost:3001/login", {
            code,
          })
          .then(res => {
            //console.log("Auth Token",res.data);
            
            setAccessToken(res.data.accessToken)
            setRefreshToken(res.data.refreshToken)
            setExpiresIn(res.data.expiresIn)
            window.history.pushState({}, null, "/") // clear from url
          }).catch(() => {
            window.location = "/"
          })
      }, [code])

      

      //invoke when refreshToken or expiresIn changes  & add a route in server.js
      //i.e /refresh post
      useEffect(() => {
        if(!refreshToken || !expiresIn ) return;
        //always invoke refresh after /login above effect call soadd delay 

        const timeout = setInterval(()=> {
          axios
          .post("http://localhost:3001/refresh", {
            refreshToken,
          })
          .then(res => {
            console.log("refreshToken Token",res.data);
            
            setAccessToken(res.data.accessToken) 
            setExpiresIn(res.data.expiresIn)
            // window.history.pushState({}, null, "/") // clear from url
          }).catch(() => {
            window.location = "/"
          })
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(timeout) // unmount clear timeout 

        
      }, [refreshToken, expiresIn])

      return accessToken;

    
}

export default useAuth
