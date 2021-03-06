import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './sensor.reducer';
import { ISensor } from 'app/shared/model/sensor.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISensorProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Sensor extends React.Component<ISensorProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { sensorList, match } = this.props;
    return (
      <div>
        <h2 id="sensor-heading">
          <Translate contentKey="rcraspiApp.sensor.home.title">Sensors</Translate>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="rcraspiApp.sensor.name">Name</Translate>
                </th>
                <th>
                  <Translate contentKey="rcraspiApp.sensor.description">Description</Translate>
                </th>
                <th>
                  <Translate contentKey="rcraspiApp.sensor.imagePath">Image Path</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sensorList.map((sensor, i) => (
                <tr key={`entity-${i}`}>
                  <td>{sensor.name}</td>
                  <td>{sensor.description}</td>
                  <td>
                    {sensor.imagePath ? (
                      <div>
                        <a href={sensor.imagePath}>
                          <img src={sensor.imagePath} style={{ maxHeight: '80px' }} />
                          &nbsp;
                        </a>
                      </div>
                    ) : null}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${sensor.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ sensor }: IRootState) => ({
  sensorList: sensor.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sensor);
