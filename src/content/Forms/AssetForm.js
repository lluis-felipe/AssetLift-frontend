import React, { Component } from 'react';
import axios from 'axios';
import {
    Grid,
    Column,
    Form,
    Stack,
    TextInput,
    Button,
    FormGroup,
    RadioButton,
    RadioButtonGroup,
    Loading,
    FormLabel,
    Theme,
    DatePicker,
    DatePickerInput,
    ComboBox,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    NumberInput,
    StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Link
} from '@carbon/react';

import { Save, Search } from '@carbon/react/icons';

class AssetForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: null,
            status: "Draft",
            model: null,
            acquisitiondate: new Date().toLocaleDateString('en-GB'),
            disposaldate: null,
            location: null,
            responsable: null,
            manufacturer: null,
            maintenanceschedule: null,
            usefullife: null,

            acquisitioncost: null,
            residualvalue: null,
            depreciationamount: null,
            actualvalue: null,

            isLoading: false,
            toUpdate: false,
            isInvalid: false,
            assetHistory: [],
            locationList: []
        };
    }

    handleChange = (event) => {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    };

    handleLocationClick = (locationName) => {
        this.setState({
            location: locationName,
            openLocation: false,
        });
    }

    calculateDepreciation = (acquisitioncost, usefullife, residualvalue, depreciationamount) => {
        if (usefullife > 0) {
            const depreciationPerYear = (acquisitioncost - residualvalue) / usefullife;
            const actualvalue = acquisitioncost - (depreciationamount * usefullife);
            this.setState({ depreciationamount: depreciationPerYear });
            this.setState({ actualvalue: actualvalue});
            this.setState({ isYearsULFinvalid: false });
        } else {
            this.setState({ depreciationamount: 0 });
            this.setState({ isYearsULFinvalid: true });
        }
    };



    handleSubmit = async (event) => {
        event.preventDefault();

        const { type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, toUpdate, acquisitioncost, residualvalue } = this.state;
        const assetID = this.getAssetID();

        if (model == null || model === "") {
            this.setState({ isInvalid: true });
        } else {
            this.setState({ isLoading: true });

            try {
                if (toUpdate) {
                    await this.updateAsset(assetID, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, acquisitioncost, residualvalue);
                    console.log(assetID);
                } else {
                    await this.createAsset(type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, acquisitioncost, residualvalue);
                }

                console.log('OK');
                window.location.href = '/asset';
            } catch (error) {
                console.error(error);
                alert('Failed to save asset. Please try again.');
                this.setState({ isLoading: false });
            }
        }
    };

    async createAsset(type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, acquisitioncost, residualvalue) {
        await axios.post('/assetlift/asset', { type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, acquisitioncost, residualvalue });
    }

    async updateAsset(assetID, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, acquisitioncost, residualvalue) {
        await axios.put(`/assetlift/asset/${assetID}`, { type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, acquisitioncost, residualvalue });
    }

    getAssetID() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('assetid');
    }

    async componentDidMount() {
        const assetID = this.getAssetID();

        try {
            const [assetResponse, locationResponse] = await Promise.all([
                axios.get(`assetlift/asset/${assetID}`),
                axios.get(`assetlift/location`)
            ]);

            const { id, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, history, acquisitioncost, residualvalue } = assetResponse.data;

            const locationList = locationResponse.data.map(({ id, locationName, description }) => ({ id, locationName, description }));

            console.log(locationList);

            this.setState({ id, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, assetHistory: history, locationList, toUpdate: true, acquisitioncost, residualvalue });

        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { id, type, status, model, acquisitiondate, disposaldate, location, responsable, manufacturer, maintenanceschedule, usefullife, isLoading, isInvalid, openAssetHistory, assetHistory, openLocation, acquisitioncost, residualvalue, depreciationamount, actualvalue, isYearsULFinvalid } = this.state;

        return (
            <Theme theme="g10">
                <Grid fullWidth>
                    <Column lg={16} md={8} sm={4}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup legendText="">
                                <Stack gap={10}>
                                    <div>
                                        <Grid>
                                            <Column lg={4} sm={4}>
                                                <TextInput id="asset" labelText="Asset" readOnly value={id} />
                                            </Column>
                                            <Column lg={4} sm={4}>
                                                <TextInput id="type" labelText="Type" onChange={this.handleChange} value={type} />
                                            </Column>
                                            <Column lg={4} sm={4}>
                                                <ComboBox
                                                    id="status"
                                                    titleText="Status"
                                                    onChange={(value) => this.setState({ status: value.selectedItem })}
                                                    value={status}
                                                    items={["Draft", "Active", "In repair", "In storage", "Inactive"]}
                                                />
                                            </Column>
                                        </Grid>
                                    </div>
                                    <div>
                                        <Stack gap={4}>
                                            <FormLabel>Asset Information</FormLabel>
                                            <Grid>
                                                <Column lg={4} sm={4}>
                                                    <TextInput id="model" labelText="Model" onChange={this.handleChange} value={model} invalid={isInvalid} />
                                                </Column>
                                                <Column lg={4} sm={4}>

                                                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                        <TextInput
                                                            id="location"
                                                            labelText="Location"
                                                            onChange={this.handleChange}
                                                            value={location}
                                                        />
                                                        <Button
                                                            //Location Dialog
                                                            hasIconOnly
                                                            kind='ghost'
                                                            renderIcon={Search}
                                                            iconDescription='Search location'
                                                            style={{ borderBottom: '1px solid #909090' }}
                                                            onClick={() => this.setState({ openLocation: true })}
                                                        />

                                                    </div>

                                                </Column>
                                                <Column lg={4} sm={4}>
                                                    <TextInput id="manufacturer" labelText="Manufacturer" onChange={this.handleChange} value={manufacturer} />
                                                </Column>
                                                <Column lg={4} sm={4}>
                                                    <TextInput id="responsable" labelText="Responsable" onChange={this.handleChange} value={responsable} />
                                                </Column>
                                            </Grid>
                                        </Stack>
                                    </div>
                                    <div>
                                        <Stack gap={1}>
                                            <Stack gap={4}>
                                                <FormLabel>Manufacturer Information</FormLabel>
                                                <Grid>
                                                    <Column lg={6} sm={4}>
                                                        <DatePicker
                                                            datePickerType="single"
                                                            dateFormat="d/m/y"
                                                            onChange={(value) => {
                                                                const date = new Date(value);
                                                                const month = date.getMonth() + 1;
                                                                const day = date.getDate();
                                                                const year = date.getFullYear();
                                                                this.setState({ acquisitiondate: `${day}/${month}/${year}` });
                                                                // console.log(`${day}/${month}/${year}`);
                                                            }}
                                                        >
                                                            <DatePickerInput
                                                                id="acquisitiondate"
                                                                labelText="Acquisition Date"
                                                                placeholder="dd/mm/yyyy"
                                                                value={acquisitiondate}
                                                            />
                                                        </DatePicker>
                                                    </Column>
                                                    <Column>
                                                        <DatePicker
                                                            datePickerType="single"
                                                            dateFormat="d/m/y"
                                                            onChange={(value) => {
                                                                const date = new Date(value);
                                                                const month = date.getMonth() + 1;
                                                                const day = date.getDate();
                                                                const year = date.getFullYear();
                                                                this.setState({ disposaldate: `${day}/${month}/${year}` });
                                                            }}
                                                        >
                                                            <DatePickerInput
                                                                id="disposaldate"
                                                                labelText="Disposal Date"
                                                                placeholder="dd/mm/yyyy"
                                                                value={disposaldate}
                                                            />
                                                        </DatePicker>
                                                    </Column>
                                                </Grid>
                                            </Stack>
                                        </Stack>
                                    </div>

                                    <div>
                                        <Stack gap={1}>
                                            <Stack gap={4}>
                                                <FormLabel>Maintenance Information</FormLabel>

                                                <Grid>

                                                    <Column lg={5} sm={4}>
                                                        <RadioButtonGroup
                                                            legendText="Maintenance Schedule"
                                                            name="maintenance-schedule"
                                                            value={maintenanceschedule}
                                                            onChange={(value) => this.setState({ maintenanceschedule: value })}
                                                        >
                                                            <RadioButton
                                                                labelText="Daily"
                                                                value="daily"
                                                                id="daily"
                                                            />
                                                            <RadioButton
                                                                labelText="Weekly"
                                                                value="weekly"
                                                                id="weekly"
                                                            />
                                                            <RadioButton
                                                                labelText="Monthly"
                                                                value="monthly"
                                                                id="monthly"
                                                            />
                                                            <RadioButton
                                                                labelText="Annually"
                                                                value="annually"
                                                                id="annually"
                                                            />
                                                        </RadioButtonGroup>
                                                    </Column>

                                                    <Column lg={4} sm={4}>
                                                        <NumberInput
                                                            id="usefullife"
                                                            label="Years of useful life"
                                                            hideSteppers={true}
                                                            invalid = { isYearsULFinvalid }
                                                            helperText= {usefullife < 1 ? "Less than one year of useful life" : usefullife == null ? "Number invalid" : null}
                                                            max={100}
                                                            min={0}
                                                            onChange={this.handleChange}
                                                            value={usefullife}
                                                        />
                                                    </Column>
                                                </Grid>
                                            </Stack>
                                        </Stack>
                                    </div>

                                    <div>
                                        <Stack gap={1}>
                                            <Stack gap={4}>
                                                <FormLabel>Values Information</FormLabel>
                                                <Grid>
                                                    <Column lg={4} sm={4}>
                                                        <NumberInput
                                                            id="acquisitioncost"
                                                            label="Acquisition Cost"
                                                            hideSteppers={true}
                                                            onChange={this.handleChange}
                                                            value={acquisitioncost}
                                                        />
                                                    </Column>
                                                    <Column lg={4} sm={4}>
                                                        <NumberInput
                                                            id="residualvalue"
                                                            label="Residual Value"
                                                            hideSteppers={true}
                                                            onChange={this.handleChange}
                                                            value={residualvalue}
                                                        />
                                                    </Column>
                                                    <Column lg={4} sm={4}>
                                                        <NumberInput
                                                            id="depreciationamount"
                                                            label="Depreciation per year"
                                                            hideSteppers={true}
                                                            onChange={this.handleChange}
                                                            value={depreciationamount}
                                                        />
                                                    </Column>
                                                    <Column lg={4} sm={4}>
                                                        <NumberInput
                                                            id="actualvalue"
                                                            label="Actual Value"
                                                            hideSteppers={true}
                                                            onChange={this.handleChange}
                                                            value={actualvalue}
                                                            helperText="Actual Value = Acquisition Cost - (Depreciation Per Year * Useful Life)"
                                                        />
                                                    </Column>
                                                </Grid>
                                            </Stack>
                                        </Stack>
                                    </div>

                                    <div>
                                        <Grid>
                                            <Column lg={2}>
                                                <Button
                                                    type="submit"
                                                    renderIcon={Save}
                                                    iconDescription="Save"
                                                    disabled={isLoading}
                                                >
                                                    Save
                                                </Button>
                                            </Column>
                                            <Column lg={3}>
                                                <Button kind="tertiary" onClick={() => this.setState({ openAssetHistory: true })}>
                                                    Asset Status History
                                                </Button>
                                            </Column>

                                            <Column lg={3}>
                                                <Button kind="tertiary" onClick={() => this.calculateDepreciation(acquisitioncost, usefullife, residualvalue, depreciationamount)}>
                                                    Calculate depreciation
                                                </Button>
                                            </Column>

                                        </Grid>
                                    </div>
                                </Stack>
                            </FormGroup>
                        </Form>
                        {isLoading && <Loading />}
                    </Column>
                </Grid>
                <ComposedModal open={openAssetHistory} onClose={() => this.setState({ openAssetHistory: false })}>
                    <ModalHeader title="Asset Status History" />
                    <ModalBody>
                        <StructuredListWrapper>
                            <StructuredListHead>
                                <StructuredListRow head>
                                    <StructuredListCell>ID</StructuredListCell>
                                    <StructuredListCell>Date Time</StructuredListCell>
                                    <StructuredListCell>Status</StructuredListCell>
                                </StructuredListRow>
                            </StructuredListHead>
                            <StructuredListBody>
                                {assetHistory.map((event) => (
                                    <StructuredListRow key={event.id}>
                                        <StructuredListCell>{event.id}</StructuredListCell>
                                        <StructuredListCell>{event.dateTime}</StructuredListCell>
                                        <StructuredListCell>{event.status}</StructuredListCell>
                                    </StructuredListRow>
                                ))}
                            </StructuredListBody>
                        </StructuredListWrapper>
                    </ModalBody>
                    <ModalFooter primaryButtonText="OK" />
                </ComposedModal>

                {/* <ComposedModal open={openDepreciation} onClose={() => this.setState({ openDepreciation: false })}>
                    <ModalHeader title="Calculate Depreciation" />
                    <ModalBody>
                        <StructuredListWrapper>
                            <StructuredListHead>
                                <StructuredListRow head>
                                    <StructuredListCell>ID</StructuredListCell>
                                    <StructuredListCell>Date Time</StructuredListCell>
                                    <StructuredListCell>Status</StructuredListCell>
                                </StructuredListRow>
                            </StructuredListHead>
                            <StructuredListBody>
                                {assetHistory.map((event) => (
                                    <StructuredListRow key={event.id}>
                                        <StructuredListCell>{event.id}</StructuredListCell>
                                        <StructuredListCell>{event.dateTime}</StructuredListCell>
                                        <StructuredListCell>{event.status}</StructuredListCell>
                                    </StructuredListRow>
                                ))}
                            </StructuredListBody>
                        </StructuredListWrapper>
                    </ModalBody>
                    <ModalFooter primaryButtonText="OK" />
                </ComposedModal> */}

                {/* Location Dialog */}
                <ComposedModal open={openLocation} onClose={() => this.setState({ openLocation: false })}>
                    <ModalHeader title="Location List" />
                    <ModalBody>
                        <StructuredListWrapper selection>
                            <StructuredListHead>
                                <StructuredListRow head>
                                    <StructuredListCell>ID</StructuredListCell>
                                    <StructuredListCell>Location</StructuredListCell>
                                    <StructuredListCell>Description</StructuredListCell>
                                </StructuredListRow>
                            </StructuredListHead>
                            <StructuredListBody>
                                {this.state.locationList.map((location) => (
                                    <StructuredListRow key={location.id} >
                                        <StructuredListCell><Link onClick={() => this.handleLocationClick(location.locationName)}>{location.id}</Link></StructuredListCell>
                                        <StructuredListCell><Link onClick={() => this.handleLocationClick(location.locationName)}>{location.locationName}</Link></StructuredListCell>
                                        <StructuredListCell><Link onClick={() => this.handleLocationClick(location.locationName)}>{location.description}</Link></StructuredListCell>
                                    </StructuredListRow>
                                ))}
                            </StructuredListBody>
                        </StructuredListWrapper>
                    </ModalBody>
                    <ModalFooter primaryButtonText="OK" />
                </ComposedModal>

            </Theme>
        );
    }
}

export default AssetForm;
