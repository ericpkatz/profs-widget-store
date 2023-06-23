import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvatar, updatePlace } from '../store';

const Profile = ()=> {
  const el = useRef();
  const elPlace = useRef();

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

  useEffect(()=> {
    if(elPlace.current){
      console.log('set up autocomplete');
      const options = {
        fields: ['address_components', 'formatted_address', 'geometry']
      };
      const autocomplete = new google.maps.places.Autocomplete(elPlace.current, options);
      autocomplete.addListener('place_changed', ()=> {
        const place = autocomplete.getPlace();
        dispatch(updatePlace({ place }));

      });      
    }
  }, [elPlace]);
  
  return (
    <div>
      <h2>Profile</h2>
      <input ref={ elPlace } style={{ height: '2rem', width: 'calc(100% - 2rem)', margin: '1rem'}}/>
      <br />
        <pre>
         {
            JSON.stringify(auth.place, null, 2)
         }
        </pre>
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


