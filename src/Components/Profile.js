import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvatar } from '../store';

const Profile = ()=> {
  const el = useRef();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  useEffect(()=> {
    if(el.current){
      el.current.addEventListener('change', (ev)=> {
        const file = ev.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener('load', ()=> {
          dispatch(updateAvatar({ avatar: reader.result}));
          ev.target.value = '';
        });
      });
    }
  }, [el]);
  
  return (
    <div>
      <h2>Profile</h2>
      <input type='file' ref={ el } />
      {
        auth.avatar ? (
          <button onClick={()=> dispatch(updateAvatar({ avatar: null }))}>Remove Your Avatar</button>
        ): null

      }
    </div>
  );
};

export default Profile;


