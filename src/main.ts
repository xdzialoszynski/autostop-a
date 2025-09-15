import { platformBrowser, BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import { provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing-module';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockApiInterceptor } from './app/services/api/interceptors/mock-api-interceptor';

bootstrapApplication(App, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule),
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(
            withInterceptors([mockApiInterceptor])
        )
    ]
})
    .catch(err => console.error(err));
