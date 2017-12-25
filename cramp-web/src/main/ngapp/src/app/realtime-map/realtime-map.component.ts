import {Component, OnInit} from '@angular/core';
import {GlobalMap} from "../resources/global-map";
import {AnalyticsService} from "../services/analytics.service";
import {ConfigService} from "../services/config.service";
import {PersonSnapshot} from "../resources/person-snapshot";
import {Observable} from "rxjs/Observable";
import {PersonImage} from "../resources/person-image";

@Component({
  selector: 'app-realtime-map',
  templateUrl: './realtime-map.component.html',
  styleUrls: ['./realtime-map.component.css']
})
export class RealtimeMapComponent implements OnInit {

  constructor(private analyticsService: AnalyticsService, private configService: ConfigService) {
  }

  updateToggle: boolean = false;
  showAllInInfo: boolean = true;

  globalMap: GlobalMap;

  selectedTrackIndex: number = -1;

  personSnapshots: PersonSnapshot[][] = [];

  private getColour(index: number): string {
    return "rgb(" + Math.round(((index / 256 / 256) * 40) % 256).toString() + "," + Math.round(((index / 256) * 40) % 256).toString() + "," + Math.round((index * 40) % 256).toString() + ")";
  }

  private getStandSitColour(person: PersonSnapshot): string {
    const standCol = Math.round(person.standProbability * 255);
    const sitCol = Math.round(person.sitProbability * 255);

    return "rgb(" + standCol.toString() + ", " + sitCol.toString() + ",255 )";
  }

  personClicked(person: PersonImage): void {
    if (person.ids.length > 0) {
      this.selectedTrackIndex = person.ids[0];
      this.showAllInInfo = false;
    }
    console.log("Person clicked" + person.ids[0].toString());
  }

  private backgroundClicked(): void {
    this.selectedTrackIndex = -1;
    this.showAllInInfo = true;
  }

  private trackClicked(track: PersonSnapshot[]): void {
    if (track[0].ids.length > 0) {
      this.selectedTrackIndex = track[0].ids[0];
      this.showAllInInfo = false;
    }
    console.log("Track clicked" + track[0].ids[0].toString());
    console.log(track);
  }

  private startMap(): void {
    Observable.interval(2000).subscribe(x => {
      console.debug("Sending real time map request");
      this.analyticsService.getRealTimeMap()
        .then(ps => {
          this.personSnapshots = ps;
          ps.forEach((item) => {
            item[0]["colour"] = this.getColour(item[0].ids[0]);
            item[0]["standSitColour"] = this.getStandSitColour(item[0]);
          });
          this.updateToggle = !this.updateToggle;
          console.log(this.updateToggle);
          console.log(this.personSnapshots);
          //this.drawOnCanvas(personSnapshots);
        })
        .catch(reason => console.log(reason));
    });
  }


  ngOnInit() {
    this.configService.getMap().then((globalMap) => {
      this.globalMap = globalMap;
      console.log(this.globalMap);
    });

    this.startMap();
  }

}