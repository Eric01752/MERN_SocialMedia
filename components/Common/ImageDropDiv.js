import React from 'react';
import { Form, Segment, Image, Icon, Header } from 'semantic-ui-react';
import { useRouter } from 'next/router';

function ImageDropDiv({
  highlighted,
  setHighlighted,
  inputRef,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia,
  profilePicUrl,
}) {
  const router = useRouter();
  const signupRoute = router.pathname === '/signup';

  return (
    <>
      <Form.Field>
        <Segment placeholder basic secondary>
          <input
            style={{ display: 'none' }}
            type='file'
            accept='image/*'
            onChange={handleChange}
            name='media'
            ref={inputRef}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setHighlighted(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setHighlighted(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setHighlighted(true);
              const droppedFile = Array.from(e.dataTransfer.files);
              setMedia(droppedFile[0]);
              setMediaPreview(URL.createObjectURL(droppedFile[0]));
            }}
          >
            {mediaPreview === null ? (
              <>
                <Segment color={highlighted ? 'green' : ''} placeholder basic>
                  {signupRoute ? (
                    <Header icon>
                      <Icon
                        name='file image outline'
                        style={{ cursor: 'pointer' }}
                        onClick={() => inputRef.current.click()}
                      />
                      Drag n Drop or Click to Upload Image
                    </Header>
                  ) : (
                    <span style={{ textAlign: 'center' }}>
                      <Image
                        src={profilePicUrl}
                        style={{ cursor: 'pointer' }}
                        onClick={() => inputRef.current.click()}
                        size='huge'
                        centered
                      />
                    </span>
                  )}
                </Segment>
              </>
            ) : (
              <>
                <Segment color='green' placeholder basic>
                  <Image
                    src={mediaPreview}
                    size='medium'
                    centered
                    style={{ cursor: 'pointer' }}
                    onClick={() => inputRef.current.click()}
                  />
                </Segment>
              </>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
}

export default ImageDropDiv;
