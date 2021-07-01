import React, { useState, useRef } from 'react';
import { Form, Button, Divider, Message } from 'semantic-ui-react';
import uploadPic from '../../utils/uploadPicToCloudinary';
import ImageDropDiv from '../Common/ImageDropDiv';
import CommonInputs from '../Common/CommonInputs';
import { profileUpdate } from '../../utils/profileActions';

function UpdateProfile({ Profile }) {
  const [profile, setProfile] = useState({
    profilePicUrl: Profile.user.profilePicUrl,
    bio: Profile.bio,
    facebook: (Profile.social && Profile.social.facebook) || '',
    twitter: (Profile.social && Profile.social.twitter) || '',
    instagram: (Profile.social && Profile.social.instagram) || '',
    youtube: (Profile.social && Profile.social.youtube) || '',
  });

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media') {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }

    if (media !== null && !profilePicUrl) {
      setLoading(false);
      return setErrorMsg('Error Uploading Image');
    }

    await profileUpdate(profile, setLoading, setErrorMsg, profilePicUrl);
  };

  return (
    <>
      <Form loading={loading} error={errorMsg !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setErrorMsg(null)}
          content={errorMsg}
          header='Oops!'
          attached
        />

        <ImageDropDiv
          inputRef={inputRef}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          handleChange={handleChange}
          mediaPreview={mediaPreview}
          setMediaPreview={setMediaPreview}
          setMedia={setMedia}
          profilePicUrl={profile.profilePicUrl}
        />

        <CommonInputs
          user={profile}
          handleChange={handleChange}
          showSocialLinks={showSocialLinks}
          setShowSocialLinks={setShowSocialLinks}
        />

        <Divider hidden />

        <Button
          color='blue'
          disabled={profile.bio === '' || loading}
          icon='pencil alternate'
          content='Submit'
          type='submit'
        />
      </Form>
    </>
  );
}

export default UpdateProfile;
