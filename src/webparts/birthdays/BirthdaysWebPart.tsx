import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneField,
} from '@microsoft/sp-webpart-base';

import { PropertyFieldPassword } from '@pnp/spfx-property-controls/lib/PropertyFieldPassword';
import Birthdays from './components/Birthdays';
import { IBirthdaysProps, IBDZUPList } from './components/IBirthdaysProps';

import {
  SPHttpClient,
  SPHttpClientResponse,
  IHttpClientOptions,
} from '@microsoft/sp-http';

export interface IBirthdaysWebPartProps {
  title: string;
  description: string;
  URL: string;
  login: string;
  password: string;
  connectionType: string;
  defaultImage: string;
  styleType: string;

}


export interface IBDZUPLists {
  value: IBDZUPList[];
}

export default class BirthdaysWebPart extends BaseClientSideWebPart<IBirthdaysWebPartProps> {
  setState(arg0: { title: string; }) {
    throw new Error('Method not implemented.');
  }
  private _getJSONListData(): Promise<IBDZUPLists> {
    const url: string = this.properties.URL;
    const authorizedUserEmail: string = this.context.pageContext.user.email;
    const bodyJSON: string = JSON.stringify({ "Email": authorizedUserEmail });
    const encodedCredentials: string = btoa(`${this.properties.login}:${this.properties.password}`);

    const requestHeaders: Headers = new Headers();
    requestHeaders.append('Content-type', 'application/json');
    requestHeaders.append('Authorization', `Basic ${encodedCredentials}`);

    const httpClientOptions: IHttpClientOptions = {
      body: bodyJSON,
      headers: requestHeaders,
    };

    return this.context.httpClient
      .post(url, SPHttpClient.configurations.v1, httpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data: IBDZUPLists) => {
        console.log(data);
        console.log(data.value);
        return { value: data};
      })
      .catch((error: any) => {
        console.error('Error:', error);
        return { value: [] };
      });
  }


  private _isRendered: boolean = false;

  private updateTitle = (newTitle: string) => {
    this.setState({ title: newTitle });
  };

  public async render(): Promise<void> {
    if (!this._isRendered) {
      this._isRendered = true;

      try {
        const response = await this._getJSONListData();
        const element: React.ReactElement<IBirthdaysProps> = React.createElement(
          Birthdays,
          {
            data: response.value,
            defaultImage: this.properties.defaultImage,
            title: this.properties.title,
          }
        );
        console.log(response);
        console.log(response.value);
        ReactDom.render(element, this.domElement);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Настройки',
          },
          groups: [
            {
              groupName: 'Базовые настройки',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Текст заголовка',
                  value:this.properties.title,
                  deferredValidationTime: 200,

                }),
              ],
            },
            {
              groupName: 'Настройка подключения',
              groupFields: [
                PropertyPaneTextField('URL', {
                  label: 'URL Списка',
                  multiline: true,
                  deferredValidationTime: 2000,
                }),
                PropertyPaneTextField('login', {
                  label: 'Логин',
                  deferredValidationTime: 200,
                }),
                PropertyFieldPassword('password', {
                  key: 'password',
                  label: 'Пароль',
                  value: this.properties.password,
                }),
                PropertyPaneDropdown('connectionType', {
                  label: 'Тип подключения',
                  options: [
                    { key: 'ZUP', text: 'ZUP Connection' },

                  ],
                }),
              ],
            },
            {
              groupName: 'Дополнительные настройки',
              groupFields: [
                PropertyPaneTextField('defaultImage', {
                  label: 'URL изображения по умолчанию',
                  deferredValidationTime: 200,
                }),
                // PropertyPaneDropdown('styleType', {
                //   label: 'Стиль',
                //   options: [
                //   { key: 'Style1', text: 'Стиль 1' },

                //   ],
                // }),
              ],
            },
          ],
        },
      ],
    };
  }


  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'defaultImage') {
      this.properties.defaultImage = newValue;
      this.render();
    }
  }
}






