import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label, FormText, Collapse, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IPin } from 'app/shared/model/pin.model';
import { getEntities as getPins } from 'app/entities/pin/pin.reducer';
import { ISensor } from 'app/shared/model/sensor.model';
import { getEntities as getSensors } from 'app/entities/sensor/sensor.reducer';
import { ITimer } from 'app/shared/model/timer.model';
import { getEntities as getTimers } from 'app/entities/timer/timer.reducer';
import { getEntity, updateEntity, createEntity, reset } from './controller.reducer';
import { IController } from 'app/shared/model/controller.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IControllerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IControllerUpdateState {
  isNew: boolean;
  pinId: string;
  sensorId: string;
  collapse: boolean;
  modal: boolean;
  isInputSensor: boolean;
  timerId: string;
}

export class ControllerUpdate extends React.Component<IControllerUpdateProps, IControllerUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      pinId: '0',
      sensorId: '0',
      timerId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id,
      collapse: false,
      modal: false,
      isInputSensor: false
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
      this.setState({ isInputSensor: !this.props.controllerEntity.sensorId });
    }

    this.props.getPins();
    this.props.getSensors();
    this.props.getTimers();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { controllerEntity } = this.props;
      const entity = {
        ...controllerEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/controller');
  };

  toggle = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  toggleModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  onChangeSensor = event => {
    this.setState({ isInputSensor: event.target.value });
  };

  render() {
    const { controllerEntity, pins, sensors, timers, timer, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="rcraspiApp.controller.home.createOrEditLabel">
              <Translate contentKey="rcraspiApp.controller.home.createOrEditLabel">Create or edit a Controller</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : controllerEntity} onSubmit={this.saveEntity}>
                <div className="mt-3">
                  <Button color="primary" onClick={this.toggle} style={{ marginBottom: '1rem' }} disabled={!isNew}>
                    <Translate contentKey="rcraspiApp.controller.preset">Preset</Translate>
                  </Button>
                  <Collapse isOpen={this.state.collapse}>
                    <AvGroup>
                      <Label for="sensor.name">
                        <Translate contentKey="rcraspiApp.controller.sensor">Sensor</Translate>
                      </Label>
                      <AvInput id="controller-sensor" type="select" className="form-control" name="sensorId" onChange={this.onChangeSensor.bind(event)}>
                        <option value="" key="0" />
                        {sensors
                          ? sensors.map(otherEntity => (
                            <option value={otherEntity.id} key={otherEntity.id}>
                              {otherEntity.name}
                            </option>
                          ))
                          : null}
                      </AvInput>
                    </AvGroup>
                  </Collapse>
                </div>
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="rcraspiApp.controller.name">Name</Translate>
                  </Label>
                  <AvField
                    id="controller-name"
                    type="text"
                    name="name"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="modeLabel">
                    <Translate contentKey="rcraspiApp.controller.mode">Mode</Translate>
                  </Label>
                  <AvInput
                    id="controller-mode"
                    type="select"
                    className="form-control"
                    name="mode"
                    value={(!isNew && controllerEntity.mode) || (this.state.isInputSensor ? 'INPUT' : 'OUTPUT')}
                    disabled={this.state.isInputSensor}
                  >
                    <option value="INPUT" disabled={!this.state.isInputSensor}>
                      <Translate contentKey="rcraspiApp.IO.INPUT" />
                    </option>
                    <option value="OUTPUT">
                      <Translate contentKey="rcraspiApp.IO.OUTPUT" />
                    </option>
                  </AvInput>
                  { isNew && !this.state.isInputSensor &&
                  <FormText color="muted">
                    <Translate contentKey="rcraspiApp.IO.message" />
                  </FormText> }
                </AvGroup>
                <AvGroup>
                  <Label id="stateLabel">
                    <Translate contentKey="rcraspiApp.controller.state">Initial State</Translate>
                  </Label>
                  <AvInput
                    id="controller-state"
                    type="select"
                    className="form-control"
                    name="state"
                    value={'false'}
                    disabled={this.state.isInputSensor}>
                    <option value="false">Low</option>
                    <option value="true">High</option>
                  </AvInput>
                </AvGroup>
                <Row>
                  <Col xs="6" sm="6">
                    <AvGroup>
                      <Label for="pin.name">
                        <Translate contentKey="rcraspiApp.controller.pin">Pin</Translate>
                      </Label>
                      <AvInput
                          id="controller-pin"
                          type="select"
                          className="form-control"
                          name="pinId"
                          required>
                        <option value={controllerEntity.pinId} key={controllerEntity.pinId}>{controllerEntity.pinName}</option>
                        {pins
                          ? pins.map(otherEntity => (
                              <option value={otherEntity.id} key={otherEntity.id}>
                                {otherEntity.name}
                              </option>
                            ))
                          : null}
                      </AvInput>
                    </AvGroup>
                  </Col>
                  <Col xs="6" sm="6">
                      <div className="mt-4" />
                      <Button color="info" onClick={this.toggleModal} className="mt-2">
                        <FontAwesomeIcon icon="eye" />
                        <span className="d-none d-md-inline">
                          &nbsp;<Translate contentKey="rcraspiApp.controller.pinHeaderModal">Show Pin Header</Translate>
                        </span>
                      </Button>
                      <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Pin Numbering - Raspberry Pi 3 Model B</ModalHeader>
                        <ModalBody>
                          <span className="pin-header rounded" />
                        </ModalBody>
                        <ModalFooter>
                          <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                      </Modal>
                  </Col>
                </Row>
                { (isNew ? !this.state.isInputSensor : !controllerEntity.sensorId) &&
                <Row>
                    <Col xs="6" sm="6">
                        <AvGroup>
                            <Label for="timer.name">
                                <Translate contentKey="rcraspiApp.controller.timer">Timer</Translate>
                            </Label>
                            <AvInput
                                id="controller-timer"
                                type="select"
                                className="form-control"
                                name="timerId"
                                value={timer.id}
                                label={timer.name}>
                                <option value="" key="0" />
                                {timers
                                    ? timers.map(otherEntity => (
                                        <option value={otherEntity.id} key={otherEntity.id}>
                                            {otherEntity.name}
                                        </option>
                                    ))
                                    : null}
                            </AvInput>
                        </AvGroup>
                    </Col>
                    <Col xs="6" sm="6">
                        <div className="mt-4" />
                        <Link to={`/entity/timer/new`} className="btn btn-primary jh-create-entity mt-2" id="jh-create-entity">
                            <FontAwesomeIcon icon="plus" />
                            <span className="d-none d-md-inline">
                              &nbsp;<Translate contentKey="rcraspiApp.timer.home.createLabel">Add a timer</Translate>
                            </span>
                        </Link>
                    </Col>
                </Row>}
                <Button tag={Link} id="cancel-save" to="/entity/controller" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  pins: storeState.pin.entities,
  sensors: storeState.sensor.entities,
  timers: storeState.timer.entities,
  timer: storeState.timer.entity,
  controllerEntity: storeState.controller.entity,
  loading: storeState.controller.loading,
  updating: storeState.controller.updating,
  updateSuccess: storeState.controller.updateSuccess
});

const mapDispatchToProps = {
  getPins,
  getSensors,
  getTimers,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControllerUpdate);
