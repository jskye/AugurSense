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

import {Injectable} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/toPromise';

import {PersonSnapshot} from "../resources/person-snapshot";

@Injectable()
export class AnalyticsService {

  private baseUrl: string = "http://localhost:8085/api/v1/analytics/";

  constructor(private http: Http) {
  }

  getRealTimeMap(): Promise<PersonSnapshot[][]> {
    return this.http.get(this.baseUrl + "realTimeMap")
      .toPromise()
      .then(response => {
        console.debug(response.json());
        return response.json() as PersonSnapshot[][]
      })
      .catch(AnalyticsService.handleError);
  }

  getHeatMap(from: number, to: number): Promise<number[][]> {
    return this.http.get(this.baseUrl + "heatMap/" + from + "/" + to)
      .toPromise()
      .then(response => {
        console.debug(response.json());
        return response.json() as number[][]
      })
      .catch(AnalyticsService.handleError);
  }

  getMap(): Promise<string> {
    return this.http.get(this.baseUrl + "getMap")
      .toPromise()
      .then(response => {
        console.debug(response.json());
        return response.json().image as string
      })
      .catch(AnalyticsService.handleError);
  }

  getCount(from: number, to: number): Promise<number> {
    return this.http.get(this.baseUrl + "count/" + from + "/" + to)
      .toPromise().then(
        response => {
          console.log(response.json());
          return response.json() as number
        }
      ).catch(AnalyticsService.handleError);
  }

  getStopPoints(from: number, to: number, radius: number, time: number, height: number, width: number): Promise<number[][]> {
    return this.http.get(this.baseUrl + "analytics/stoppoints/" + from + "/" + to + "/" + radius + "/" + time + "/"
      + height + "/" + width)
      .toPromise().then(
        response => {
          console.log(response.json());
          return response.json() as number[][]
        }
      ).catch(AnalyticsService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
