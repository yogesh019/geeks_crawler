from django.shortcuts import render,get_object_or_404,redirect
from django.http import HttpResponse,Http404,JsonResponse
from django.views.decorators.http import require_GET,require_POST
from django.core.urlresolvers import reverse
import requests
import re
from bs4 import BeautifulSoup
# Create your views here.


#HomePage

def home(request):
    return render(request,'crawler/home.html')


base_url="http://www.geeksforgeeks.org/tag/"

@require_GET
def getListOfArticles(request):
    print("yogesh sharma")
    if request.is_ajax():
        company_name=request.GET.get('company','')
        category=request.GET.get('category','')

        if category=='Internship':
            article_class='category-internship-interview-experiences'
        else:
            article_class='category-interview-experiences'

        page_no=1
        search_url=base_url+company_name+"/page/"+str(page_no)+"/"
            
        response=requests.get(search_url)
        soup=BeautifulSoup(response.text,'lxml')


        try:
            last_page_text=soup.find('div',{'class':'wp-pagenavi'}).find('span',{'class':'pages'}).text
            #print(last_page_text)
            max_page_no=int(last_page_text.split(' ')[-1])
        except:
            max_page_no=1;
        
        
        return_articles=[]
        #print(max_page_no)
        while page_no<=max_page_no:
            #print(page_no)
            search_url=base_url+company_name+"/page/"+str(page_no)+"/"
            
            response=requests.get(search_url)
            soup=BeautifulSoup(response.text,'lxml')

            list_articles=soup.findAll('article',{'class':re.compile(article_class)})
        

            for article in list_articles:

                a_tag=article.find('h2',{'class':'entry-title'}).find('a')
                title=a_tag.text
                link=a_tag['href']
                date=article.find('div',{'class':'post-date'}).text
                return_article={
                'title':title,
                'link':link,
                'date':date,
                }
                bool_intern=False
                if category!="Internship":
                    tags=article.findAll('div',{'class':'categoryButton'})
                    for tag in tags:
                        tn=tag.find('a').text
                        if tn=="Internship" or tn=="Experienced":
                            #print(tn)
                            bool_intern=True
                            break
                
                if not bool_intern:
                    return_articles.append(return_article)

            page_no=page_no+1

        data={
            'list_articles':return_articles,
            'total_count':len(return_articles),
        }

        return JsonResponse(data)

@require_GET
def combineContent(request):
    if request.is_ajax():
        list_article_urls=request.GET.getlist('link_articles','')
        list_article_urls=[str(x) for x in list_article_urls]
        html=""
        for url in list_article_urls:
            response=requests.get(url)
            soup=BeautifulSoup(response.text,'lxml')
            article=soup.find('article')
            heading=str(article.find('header'))
            content=str(article.find('div',{'class':'entry-content'}))
            content = content[0:re.search("<div class=\"AdsParent\"", content).start()-1]
            html += heading + content

        #print(html)
        data = {
            'content' : html,
            'count' : len(list_article_urls),
        }
        return JsonResponse(data)



        







                
        

    

