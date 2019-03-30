function PatentHelper(){
    // User Story: PROF-36 | VIP-19, enwam001 (advanced patent search)
    // Add additional search parameters.
    this.getEpoUrl = function(query, begin, end, first_name, last_name, organization, page = 0, entries = 10){
        var url = "https://cors-anywhere.herokuapp.com/http://ops.epo.org/3.2/rest-services/published-data/search/abstract,biblio,full-cycle?q="

        if(begin != undefined && end != undefined){                 
          //url += 'pd%3E'+ formatDate(begin).replace(/-/g,"")  + '%20and%20pd%3C' + formatDate(end).replace(/-/g,"") + '%20and%20';   
          } //error- 413 payload is to large

        if (first_name != undefined && first_name.replace(/ +/g, ' ') !==''){
          url+="in%3D" + first_name + "%20and%20";   
        } 
      
        if (last_name != undefined && last_name.replace(/ +/g, ' ') !==''){
          url+="in%3D" + last_name + "%20and%20";   
        }   
      
        if (organization != undefined && organization.replace(/ +/g, ' ') !==''){
         url+="applicant%3D" + organization + "%20and%20";   
        }
      
        if (query == undefined || query.replace(/ +/g, ' ') ==''){
          url = url.slice(0, -9)
        } else {
          url+= 'ti%20all%20"' + query +'"'
        }


        url += "&Range=" + (page*10 + 1) + "-" + (page*10 + entries);    
        return url;
    }    

    // User Story: PROF-36 | VIP-19, enwam001 (advanced patent search)
    // Add additional search parameters.
    this.getUsptoUrl = function (query, begin, end, first_name, last_name, organization, page = 0, entries = 10){
        var fields = '&f=["patent_date","patent_title","patent_number","patent_number","inventor_first_name", "inventor_last_name","patent_type","assignee_organization","assignee_first_name","assignee_last_name","patent_kind","patent_year","cited_patent_title","cited_patent_number","patent_abstract"]';
        var url = 'https://cors-anywhere.herokuapp.com/http://www.patentsview.org/api/patents/query?q={"_and":[';                
        var date_range = '{"_gte":{"patent_date":"';  // sometimes, the search results include patents from 1 year before the start date
        if(begin != undefined && end != undefined){
          date_range += formatDate(begin) + '"}},{"_lte":{"patent_date":"'
          date_range += formatDate(end) + '"}},' 
          url += date_range;        
        } 
      
        if (first_name != undefined && first_name.replace(/ +/g, ' ') !==''){
          var inventor_first_name = '{"inventor_first_name":["' + first_name +'"]},';
          url += inventor_first_name;
        }
      
        if (last_name != undefined && last_name.replace(/ +/g, ' ') !==''){
          var inventor_last_name = '{"inventor_last_name":["' + last_name+'"]},';
          url += inventor_last_name;
        }
        
      
        if (organization != undefined && organization.replace(/ +/g, ' ') !==''){
          var organization_name = '{"assignee_organization":["' + organization +'"]},';
          url += organization_name;
        }
      
        if (query == undefined || query.replace(/ +/g, ' ') == ''){
          url = url.slice(0, -1)  +  ']}';
        } else {
          var title_argument = '{"_text_all":{"patent_title":"' + query.replace(/ +/g, ' ').trim() + '"}}'
          url += title_argument+ ']}';
        }
        url+= '&o={"page":' + page + ',"per_page":' + entries + '}' + fields;
        return url
    }
    
    this.getUsptoV2Url = function (query, begin, end, first_name, last_name, organization, start = 0, entries = 10){
      var url ='https://developer.uspto.gov/ibd-api/v1/patent/application?criteriaSearchText=documentType%3Agrant%20AND%20' 


        if(begin != undefined && end != undefined){
           //formatDate(begin)                 
        } 
      
        if (first_name != undefined && first_name.replace(/ +/g, ' ') !==''){
          url += 'inventor%3A' + first_name + "%20AND%20";
        }

        if (last_name != undefined && last_name.replace(/ +/g, ' ') !==''){
          url += 'inventor%3A' + last_name + "%20AND%20";
        }
      
        if (organization != undefined && organization.replace(/ +/g, ' ') !==''){
          url += 'assignee%3A' + organization.replace(/ +/g, ' ').trim().replace(/ +/g, '%20AND%20assignee%3A') + "%20AND%20";
        }
      
        if (query == undefined || query.replace(/ +/g, ' ') ==''){
          url = url.slice(0, -9)
        } else {
          url += 'title%3A' + query.replace(/ +/g, ' ').trim().replace(/ +/g, '%20AND%20title%3A');
        }
        url+='&start='+ start + '&rows=' + entries;
        return url
    }

    // User Story: PROF-35 | VIP-19, croja022 (business search)
    // Returns a properly formated YELP API URL.
    this.getYelpUrl = function(term, location, limit, offset){
      //Yelp does not like front end calls to their API, so a wrapper for a backened is used.
      var url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?"
      var originalLength = url.length;
      if(term)
        url+= "term=" + term;
      if(term && location)
        url+= "&location=" + location;
      else if(location)
        url+= "location=" + location;
      if (url.length == originalLength)
        return "";
      // User Story: PROF-56 | VIP-19, croja022 (business search infinite scrolling)
      if (limit)
        url+= "&limit=" + limit;
      if (offset)
        url+= "&offset=" + offset;
      //END User Story: PROF-56 | VIP-19, croja022 (business search infinite scrolling)
      return url;
    }    
    this.YelpKey = "GNISV2TzAVHyivTMoE9RisamkR3EG9ruuy6U6IPLEVZXtSFRWrnTP6vQLz-4g6Ls-f67NZqraWbaxanC_k1O4DLqzTFPaih3QdK7VudKvzuKDWBQpzPK7ItSH9PQW3Yx";
    // User Story: PROF-54 | VIP-19, croja022 (business search error handling)
    this.getBusinessSearchErrorMessage = function(database){
      return database ? "The " + database + " service is experiencing difficulties.\n Please try again later." : "";
    }
    //END User Story: PROF-54 | VIP-19, croja022 (business search error handling)
    this.encodedData = window.btoa('fvbXgzyKWxgjlBIfM7b7ydIBZ0bJ5mq5:THQOA12DnPg2jKmO'); //keys are taken from a registred accout at this url: https://developers.epo.org/


    // User Story: PROF-9 | VIP-19, croja022 (business search report feature)

    this.yelpModelToString = function (model) {
      var result = "";
      if(model.name)
        result += model.name;
      if(model.name && model.phone)
        result += " - ";
      if(model.phone)
        result += model.phone;
      return result;
    }

    // User Story: PROF-8 | VIP-19, croja022 (business search report feature)
    this.ustpoModelToString = function (model) {
      var result = "";
      if(model.patent_title)
        result += model.patent_title;
      if(model.patent_title && model.patent_number)
        result += " - ";
      if(model.patent_number)
        result += model.patent_number;
      return result;
    }

    this.ustpoV2ModelToString = function (model) {
      var result = "";
      if(model.title)
        result += model.title;
      if(model.title && model.patentNumber)
        result += " - ";
      if(model.patentNumber)
        result += model.patentNumber;
      return result;
    }
    //END User Story: PROF-8 | VIP-19, croja022 (business search report feature)
    
    this.copyToClipboard = function (str){
      var el = document.createElement('textarea');
      //el.setAttribute("hidden", "true");
      el.value = str;
      el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      var selected =            
      document.getSelection().rangeCount > 0        // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0)     // Store selection if found
      : false;        
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (selected) {                                 // If a selection existed before copying
          document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
          document.getSelection().addRange(selected);   // Restore the original selection
      }
    }
    //END User Story: PROF-9 | VIP-19, croja022 (business search report feature)    


    this.getCategory = function(letter){
      var category = "";
      switch (letter){
        case 'A':
          category = "Human necessities"
          break;
        case 'B':
          category = "Performing operations; transporting"
          break;
        case 'C':
          category = "Chemistry; metallurgy"
          break;
        case 'D':
          category = "Textiles; paper"
          break;
        case 'E':
          category = "Fixed constructions"
          break;
        case 'F':
          category = "Mechanical engineering; lighting; heating; weapons; blasting engines or pumps"
          break;
        case 'G':
          category = "Physics"
          break;
        case 'H':
          category = "Electricity"
          break;
        case 'Y':
          category = "New technological developments"
          break;
      }

      return category;
    }

    return this;
    }
    
  function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return [year, month, day].join('-');
  }