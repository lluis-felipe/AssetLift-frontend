import React, { Component } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
} from '@carbon/react';
import { InfoSection, InfoCard } from '../../components/Info';
import { Globe, Application, PersonFavorite } from '@carbon/react/icons';

class LandingPage extends Component {
  render() {

    return (
      <Grid className="landing-page" fullWidth>
        <Column lg={16} md={8} sm={4} className="landing-page__banner">
          <Breadcrumb noTrailingSlash aria-label="Page navigation">
            <BreadcrumbItem>
              <a href="/">Getting started</a>
            </BreadcrumbItem>
          </Breadcrumb>
          <h1 className="landing-page__heading">
            Asset Lift
          </h1>
        </Column>
        <Column lg={16} md={8} sm={4} className="landing-page__r2">
          <Tabs defaultSelectedIndex={0}>
            <TabList className="tabs-group" aria-label="Tab navigation">
              <Tab>About</Tab>
              <Tab>Design</Tab>
              <Tab>Develop</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Grid className="tabs-group-content">
                  <Column
                    md={4}
                    lg={7}
                    sm={4}
                    className="landing-page__tab-content">
                    <h2 className="landing-page__subheading">What is Asset Lift?</h2>
                    <p className="landing-page__p">
                      Asset Lift is a software for asset management that helps organizations keep track of their physical assets such as equipment, machinery, and vehicles. It allows users to monitor asset utilization, maintenance schedules, and location tracking, which helps to optimize asset performance and reduce costs. The software is user-friendly and customizable, making it easy to adapt to the unique needs of different industries and businesses. With Asset Lift, organizations can improve their asset management practices and increase their operational efficiency.
                    </p>
                    <Button>Learn more</Button>
                  </Column>
                  <Column md={4} lg={{ span: 8, offset: 7 }} sm={4}>
                    <img
                      className="landing-page__illo"
                      src={`${process.env.PUBLIC_URL}/tab-illo.png`}
                      alt="Carbon illustration"
                    />
                  </Column>
                </Grid>
              </TabPanel>
              <TabPanel>
                <Grid className="tabs-group-content">
                  <Column
                    lg={16}
                    md={8}
                    sm={4}
                    className="landing-page__tab-content">
                    Rapidly build beautiful and accessible experiences. The Carbon
                    kit contains all resources you need to get started.
                  </Column>
                </Grid>
              </TabPanel>
              <TabPanel>
                <Grid className="tabs-group-content">
                  <Column
                    lg={16}
                    md={8}
                    sm={4}
                    className="landing-page__tab-content">
                    Carbon provides styles and components in Vanilla, React,
                    Angular, and Vue for anyone building on the web.
                  </Column>
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
        <Column lg={16} md={8} sm={4} className="landing-page__r3">
          <InfoSection heading="The Principles">
            <InfoCard
              heading="Carbon is Open"
              body="It's a distributed effort, guided by the principles of the open-source movement. Carbon's users are also it's makers, and everyone is encouraged to contribute."
              icon={() => <PersonFavorite size={32} />}
            />
            <InfoCard
              heading="Carbon is Modular"
              body="Carbon's modularity ensures maximum flexibility in execution. It's components are designed to work seamlessly with each other, in whichever combination suits the needs of the user."
              icon={() => <Application size={32} />}
            />
            <InfoCard
              heading="Carbon is Consistent"
              body="Based on the comprehensive IBM Design Language, every element and component of Carbon was designed from the ground up to work elegantly together to ensure consistent, cohesive user experiences."
              icon={() => <Globe size={32} />}
            />
          </InfoSection>
        </Column>
      </Grid>
    );
  }
};

export default LandingPage;
