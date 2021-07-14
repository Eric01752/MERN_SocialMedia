import React, { createRef } from 'react';
import HeadTags from './HeadTags';
import Navbar from './Navbar';
import {
  Container,
  Visibility,
  Grid,
  Sticky,
  Ref,
  Divider,
  Segment,
  GridColumn,
} from 'semantic-ui-react';
import nProgress from 'nprogress';
import Router, { useRouter } from 'next/router';
import SideMenu from '../Layout/SideMenu';
import Search from '../Layout/Search';

function Layout({ children, user }) {
  const contextRef = createRef();
  const router = useRouter();

  const messagesRoute = router.pathname === '/messages';

  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();

  return (
    <>
      <HeadTags />
      {user ? (
        <>
          <div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
            <Ref innerRef={contextRef}>
              <Grid>
                {!messagesRoute ? (
                  <>
                    <Grid.Column floated='left' width={2}>
                      <Sticky context={contextRef}>
                        <SideMenu user={user} />
                      </Sticky>
                    </Grid.Column>

                    <Grid.Column width={10}>
                      <Visibility context={contextRef}>{children}</Visibility>
                    </Grid.Column>

                    <Grid.Column width={4}>
                      <Sticky context={contextRef}>
                        <Segment basic>
                          <Search />
                        </Segment>
                      </Sticky>
                    </Grid.Column>
                  </>
                ) : (
                  <>
                    <Grid.Column floated='left' width={1} />
                    <Grid.Column width={15}>{children}</Grid.Column>
                  </>
                )}
              </Grid>
            </Ref>
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <Container style={{ paddingTop: '1rem' }} text>
            {children}
          </Container>
        </>
      )}
    </>
  );
}

export default Layout;
