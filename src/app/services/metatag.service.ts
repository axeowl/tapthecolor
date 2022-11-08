import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetatagService {

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  setMeta(){
    this.meta.addTags([
      { name: 'keywords', content: 'Game, Colors, Friends, Android, IoS, Mobile, Player' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content:'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { name: 'description', content: 'Test your attention matching the right colors and backgrounds and challenge your friends!'},
    ])
  }

  updateMeta(name:string, content:string):void{
    this.meta.updateTag({
      name: name, 
      content: content
    });
  }

  setTitle(title:string):void {
    this.title.setTitle(title);
  }

  getTitle():string {
    return this.title.getTitle();
  }

  setSocialTag(title:string, description:string, img:string, id:string, home=false):void{
      this.meta.updateTag({ name: 'description', content: description});
      
      this.meta.updateTag({ name: 'twitter:card', content: "summary_large_image"});
      this.meta.updateTag({ name: 'twitter:title', content: title});
      this.meta.updateTag({ name: 'twitter:description', content: description});
      this.meta.updateTag({ name: 'twitter:image', content: img});
      this.meta.updateTag({ name: 'twitter:image:alt ', content: 'Tapthecolor logo'});
      this.meta.updateTag({ name: 'twitter:site', content: "tapthecolor.com"});
      this.meta.updateTag({ name: 'twitter:creator', content: 'TapTheColor'});

      this.meta.updateTag({ name: 'og:title', content: title});
      this.meta.updateTag({ name: 'og:description', content: description});
      this.meta.updateTag({ name: 'og:url', 
        content:  '"https://tapthecolor.com/'
      });
      this.meta.updateTag({ name: 'og:image', content: img});
      this.meta.updateTag({ name: 'og:image:alt', content: 'Tapthecolor logo'});
      this.meta.updateTag({ name: 'og:site_name', content: "tapthecolor.com"});
      this.meta.updateTag({ name: 'og:locale', content: "it_IT"});
      this.meta.updateTag({ name: 'og:type', content: "article"});
  }
}
