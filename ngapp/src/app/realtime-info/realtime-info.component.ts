import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PersonImage} from '../resources/person-image';
import {AnalyticsService} from '../services/analytics.service';
import {ConfigService} from '../services/config.service';

@Component({
  selector: 'app-realtime-info',
  templateUrl: './realtime-info.component.html',
  styleUrls: ['./realtime-info.component.css']
})
export class RealtimeInfoComponent implements OnInit {

  private _id = -1;
  private _segmentIndex = -1;
  private _useTrackSegment = false;
  private _showAll = false;
  private _refreshToggle = false;
  @Input()
  private useRealtimeEndpoint = true;

  private personImages: PersonImage[] = null;
  private _from = 0;
  private _to = 0;

  @Input()
  reIDOnClick = false;


  @Output()
  personClicked: EventEmitter<PersonImage> = new EventEmitter<PersonImage>();


  constructor(private analyticsService: AnalyticsService, private configService: ConfigService) {
  }

  ngOnInit() {
  }

  get segmentIndex(): number {
    return this._segmentIndex;
  }

  @Input()
  set segmentIndex(value: number) {
    this._segmentIndex = value;
    this.refresh();
  }

  get useTrackSegment(): boolean {
    return this._useTrackSegment;
  }

  @Input()
  set useTrackSegment(value: boolean) {
    this._useTrackSegment = value;
    this.refresh();
  }

  get to(): number {
    return this._to;
  }

  @Input()
  set to(value: number) {
    this._to = value;
    this.refresh();
  }

  get from(): number {
    return this._from;
  }

  @Input()
  set from(value: number) {
    this._from = value;
    this.refresh();
  }

  get refreshToggle(): boolean {
    return this._refreshToggle;
  }

  @Input()
  set refreshToggle(value: boolean) {
    this._refreshToggle = value;
    this.refresh();
  }

  get showAll(): boolean {
    return this._showAll;
  }

  @Input() set showAll(value: boolean) {
    this._showAll = value;
    this.personImages = null;
    this.refresh();
  }

  imageClicked(person: PersonImage): void {
    this.personClicked.emit(person);
  }

  get id(): number {
    return this._id;
  }

  @Input() set id(value: number) {
    this._id = value;
    console.log('id' + value.toString());
    this.personImages = null;
    this.refresh();
  }

  refresh(): void {
    console.log('Refresh');

    if (this.useRealtimeEndpoint) {
      if (!this.showAll) {
        if (this.id < 0) {
          this.personImages = null;
          return;
        } else {
          this.analyticsService.getRealtimeInfo(this.id).then((pi) => {
            if (this.id < 0 || this.useRealtimeEndpoint === false) {
              return;
            }

            this.personImages = pi;
            console.log(pi);
          });
        }

      } else {
        this.analyticsService.getRealtimeAllInfo().then((pi) => {
          if (this.useRealtimeEndpoint === false || this.id >= 0) {
            return;
          }

          this.personImages = pi;
          console.log(pi);
        });
      }

    } else {
      if (!this.showAll) {
        if (this.id < 0) {
          this.personImages = null;
          console.log('cleared');
          return;
        } else {
          this.analyticsService.getPastInfo(this.id, this.segmentIndex, this.useTrackSegment).then((pi) => {
            if (this.id < 0 || this.useRealtimeEndpoint === true) {
              return;
            }
            console.log('fetched ' + this.id);
            this.personImages = pi;
            console.log(pi);
          });
        }
      } else {
        console.log('Requesting timebound photos');
        this.analyticsService.getTimeboundAllPhotos(this.from, this.to).then((pi) => {
          if (this.useRealtimeEndpoint === true || this.id >= 0) {
            return;
          }

          this.personImages = pi;
          console.log(pi);
        });
      }


    }


  }

  getDateString(timestamp: number) {
    return new Date(timestamp).toLocaleString();
  }
}