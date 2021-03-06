import {Component, Input, OnInit} from '@angular/core';
import {ZoneStatistic} from "../../resources/zone-statistic";
import {Zone} from "../../resources/zone"
import {PersonImage} from "../../resources/person-image";
import {AnalyticsService} from "../../services/analytics.service";

@Component({
  selector: 'app-zone-info',
  templateUrl: './zone-info.component.html',
  styleUrls: ['./zone-info.component.css']
})
export class ZoneInfoComponent implements OnInit {
  get to(): Date {
    return this._to;
  }

  @Input()
  set to(value: Date) {
    this._to = value;
    this.inflowPersons = null;
    this.outflowPersons = null;
    this.refreshData();
  }

  get from(): Date {
    return this._from;
  }

  @Input()
  set from(value: Date) {
    this._from = value;
    this.inflowPersons = null;
    this.outflowPersons = null;
    this.refreshData();
  }

  get activeView(): string {
    return this._activeView;
  }

  set activeView(value: string) {
    this.inflowPersons = null;
    this.outflowPersons = null;

    this._activeView = value;
    this.refreshData();
  }

  constructor(private analyticsService: AnalyticsService) {

  }

  getTotal(): number {
    return this.zoneStatistics[this.selectedIndex].totalIncoming + this.zoneStatistics[this.selectedIndex].totalOutgoing;
  }

  private totalFlowView = "totalFlow";
  private averagePeopleCountView = "averagePeopleCount";
  private _activeView: string = this.averagePeopleCountView;
  private _zones: Zone[];
  private _zoneStatistics: ZoneStatistic[];
  private _selectedIndex: number = -1;

  private fromTimestamp: string;
  private toTimestamp: string;

  private chartOptions: any = {animation: {duration: 0}};

  get zones(): Zone[] {
    return this._zones;
  }

  private _from: Date;
  private _to: Date;

  @Input() set zones(value: Zone[]) {
    this._zones = value;
    this.inflowPersons = null;
    this.outflowPersons = null;

    this.refreshData();
  }

  @Input() set selectedIndex(index: number) {
    this._selectedIndex = index;
    this.inflowPersons = null;
    this.outflowPersons = null;

    this.refreshData();
  }

  @Input() set zoneStatistics(value: ZoneStatistic[]) {
    this._zoneStatistics = value;
    this.refreshData();
  }

  get zoneStatistic(): ZoneStatistic {
    if (this._selectedIndex < 0)
      return null;
    return this._zoneStatistics[this._selectedIndex];
  }

  get selectedIndex(): number {
    return this._selectedIndex;
  }


  get zoneStatistics(): ZoneStatistic[] {
    return this._zoneStatistics;
  }

  private incomingData: any;
  private outgoingData: any;
  private averageCountVariationData: any;
  averageStandingCountView: string = "averageStandingCount";
  averageStandingCountVariationData: any;
  averageSittingCountView: string = "averageSittingCount";
  averageSittingCountVariationData: any;

  inflowView: string = "inflowView";
  outflowView: string = "outflowView";
  movementSpeedView: string = "movementSpeedView";

  inflowPersons: PersonImage[] = null;
  outflowPersons: PersonImage[] = null;


  getDateString(timestamp: number) {
    return new Date(timestamp).toLocaleString();
  }


  useSegments: boolean = true;


  refreshInflowPersons() {
    if (this.activeView != this.inflowView)
      return;

    if (this.selectedIndex < 0) {
      this.inflowPersons = null;
    }

    this.analyticsService.getZoneInflowPhotos(this.from.getTime(), this.to.getTime(), this.zones[this.selectedIndex].id, this.useSegments).then((pi) => {
      this.inflowPersons = pi;
      console.log(pi);
    });
  }

  refreshOutflowPersons() {
    if (this.activeView != this.outflowView)
      return;

    if (this.selectedIndex < 0) {
      this.outflowPersons = null;
    }

    this.analyticsService.getZoneOutflowPhotos(this.from.getTime(), this.to.getTime(), this.zones[this.selectedIndex].id, this.useSegments).then((pi) => {
      this.outflowPersons = pi;
      console.log(pi);
    });
  }

  switchView(newView: string): void {
    this.activeView = newView;
  }

  refreshData() {

    if (this.zones == null)
      return;

    if (this.zoneStatistic == null)
      return;

    this.fromTimestamp = new Date(this.zoneStatistic.fromTimestamp).toLocaleString();
    this.toTimestamp = new Date(this.zoneStatistic.toTimestamp).toLocaleString();

    console.log(this.zoneStatistic.fromTimestamp);

    var incomingDataLabels = [];
    var incomingData = [];

    for (var key in this.zoneStatistic.incomingMap) {
      if (this.zoneStatistic.incomingMap.hasOwnProperty(key)) {
        incomingDataLabels.push(this.zones.filter(value => {
          return value.id.toString() == key;
        })[0].zoneName);
        incomingData.push(this.zoneStatistic.incomingMap[key])
      }
    }

    this.incomingData = {
      labels: incomingDataLabels,
      datasets: [
        {
          data: incomingData,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };

    var outgoingDataLabels = [];
    var outgoingData = [];

    for (var key in this.zoneStatistic.outgoingMap) {
      if (this.zoneStatistic.outgoingMap.hasOwnProperty(key)) {
        outgoingDataLabels.push(this.zones.filter(value => {
          return value.id.toString() == key;
        })[0].zoneName);
        outgoingData.push(this.zoneStatistic.outgoingMap[key])
      }
    }

    this.outgoingData = {
      labels: outgoingDataLabels,
      datasets: [
        {
          data: outgoingData,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
    };

    let averageCountVariationLabels: string[] = [];
    let averageCountVariationValues: number[] = [];

    for (let key in this.zoneStatistic.totalCountVariation) {
      if (this.zoneStatistic.totalCountVariation.hasOwnProperty(key)) {
        averageCountVariationLabels.push(new Date(parseInt(key)).toLocaleTimeString());
        averageCountVariationValues.push(this.zoneStatistic.totalCountVariation[key]);
      }
    }

    this.averageCountVariationData = {
      labels: averageCountVariationLabels,
      datasets: [
        {
          label: 'Average People Count',
          data: averageCountVariationValues,
          fill: false,
          borderColor: '#4bc0c0'
        },
      ]
    };


    let averageSittingCountVariationLabels: string[] = [];
    let averageSittingCountVariationValues: number[] = [];

    for (let key in this.zoneStatistic.totalSittingCountVariation) {
      if (this.zoneStatistic.totalSittingCountVariation.hasOwnProperty(key)) {
        averageSittingCountVariationLabels.push(new Date(parseInt(key)).toLocaleTimeString());
        averageSittingCountVariationValues.push(this.zoneStatistic.totalSittingCountVariation[key]);
      }
    }

    this.averageSittingCountVariationData = {
      labels: averageSittingCountVariationLabels,
      datasets: [
        {
          label: 'Average Sitting People Count',
          data: averageSittingCountVariationValues,
          fill: false,
          borderColor: '#00d01c'
        },
      ]
    };

    let averageStandingCountVariationLabels: string[] = [];
    let averageStandingCountVariationValues: number[] = [];

    for (let key in this.zoneStatistic.totalStandingCountVariation) {
      if (this.zoneStatistic.totalStandingCountVariation.hasOwnProperty(key)) {
        averageStandingCountVariationLabels.push(new Date(parseInt(key)).toLocaleTimeString());
        averageStandingCountVariationValues.push(this.zoneStatistic.totalStandingCountVariation[key]);
      }
    }

    this.averageStandingCountVariationData = {
      labels: averageStandingCountVariationLabels,
      datasets: [
        {
          label: 'Average Standing People Count',
          data: averageStandingCountVariationValues,
          fill: false,
          borderColor: '#e92890'
        },
      ]
    };

    this.refreshInflowPersons();
    this.refreshOutflowPersons();
  }

  velocityMeasureTimeInterval: number = 1000;


  ngOnInit() {
    //
    // setInterval(() => {
    //   this.zoneStatistic = { zoneId:0, zoneName:"leftZone", averagePersonCount:100, averageSittingCount:50, averageStandingCount:50, fromTimeStamp: 0, toTimeStamp: 100,
    //     totalIncoming: 10, totalOutgoing: 10, incomingMap:{3:10}, outgoingMap: {3:6,4:4}};
    //
    // },1000);
  }

}
