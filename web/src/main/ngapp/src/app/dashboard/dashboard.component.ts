/*
 * Copyright 2017 Eduze
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {Observable} from 'rxjs/Rx';

import {AnalyticsService} from "../services/analytics.service";
import {PersonSnapshot} from "../resources/person-snapshot";
import {CanvasUtils} from "../lib/utils/canvas-utils";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styles: ['canvas { border: 1px solid #000; }']
})

export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvas: ElementRef;
  private cx: CanvasRenderingContext2D;

  mapImage: string;
  personSnapshots: PersonSnapshot[][] = [[]];

  constructor(private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
  }

  configureCanvas(canvasEl: HTMLCanvasElement): void {
    this.cx = canvasEl.getContext('2d');

    // set some default properties about the line
    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
  }

  private startMap(): void {
    Observable.interval(2000).subscribe(x => {
      console.debug("Sending real time map request");
      this.analyticsService.getRealTimeMap()
        .then(personSnapshots => {
          console.debug(personSnapshots);
          this.personSnapshots = personSnapshots;
          this.drawOnCanvas(personSnapshots);
        })
        .catch(reason => console.log(reason));
    });
  }

  private drawOnCanvas(personSnapshots: PersonSnapshot[][]): void {
    if (!this.cx) {
      console.error("cx is not set");
      return;
    }

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    personSnapshots.forEach(snapshots => {
      let prev: PersonSnapshot;
      for (let i in snapshots) {
        if (prev) {
          this.cx.beginPath();
          this.cx.moveTo(prev.x, prev.y);
          this.cx.lineTo(snapshots[i].x, snapshots[i].y);
          this.cx.stroke();
        }

        prev = snapshots[i];
      }
    });
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    // set the width and height
    canvasEl.width = 800;
    canvasEl.height = 800;

    // set some default properties about the line
    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.analyticsService.getMap()
      .then(image => {
        this.mapImage = "data:image/JPEG;base64," + image;
        CanvasUtils.setBackgroundImage(this.canvas.nativeElement, this.mapImage, this.configureCanvas, this)
      })
      .catch(reason => console.error(reason));
  }
}
