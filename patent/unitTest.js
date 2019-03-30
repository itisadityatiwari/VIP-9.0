QUnit.test( "EPO basic search test", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getEpoUrl("car");
  var expected = 'https://cors-anywhere.herokuapp.com/http://ops.epo.org/3.2/rest-services/published-data/search/abstract,biblio,full-cycle?q=ti%20all%20"car"&Range=1-10';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "EPO advanced search (inventor) test", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getEpoUrl(undefined,undefined,undefined,"masoud");
  var expected = 'https://cors-anywhere.herokuapp.com/http://ops.epo.org/3.2/rest-services/published-data/search/abstract,biblio,full-cycle?q=in%3Dmasoud&Range=1-10';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "EPO advanced search (assignee organization) test", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getEpoUrl(undefined,undefined,undefined,undefined,"florida international university");
  var expected = 'https://cors-anywhere.herokuapp.com/http://ops.epo.org/3.2/rest-services/published-data/search/abstract,biblio,full-cycle?q=in%3Dflorida international university&Range=1-10';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "EPO patent category  test", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getCategory("A");
  var expected = 'Human necessities';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "USPTO basic search test", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getUsptoUrl("car");
  var expected = 'https://cors-anywhere.herokuapp.com/http://www.patentsview.org/api/patents/query?q={"_and":[{"_text_all":{"patent_title":"car"}}]}&o={"page":0,"per_page":10}&f=["patent_date","patent_title","patent_number","patent_number","inventor_first_name", "inventor_last_name","patent_type","assignee_organization","assignee_first_name","assignee_last_name","patent_kind","patent_year","cited_patent_title","cited_patent_number","patent_abstract"]';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "USPTO advanced search (date) test", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getUsptoUrl("car", "Mon Jan 01 2018 00:00:00 GMT-0500 (Eastern Standard Time)", "Wed Jan 03 2018 00:00:00 GMT-0500 (Eastern Standard Time)");
  var expected = 'https://cors-anywhere.herokuapp.com/http://www.patentsview.org/api/patents/query?q={"_and":[{"_gte":{"patent_date":"2018-01-01"}},{"_lte":{"patent_date":"2018-01-03"}},{"_text_all":{"patent_title":"car"}}]}&o={"page":0,"per_page":10}&f=["patent_date","patent_title","patent_number","patent_number","inventor_first_name", "inventor_last_name","patent_type","assignee_organization","assignee_first_name","assignee_last_name","patent_kind","patent_year","cited_patent_title","cited_patent_number","patent_abstract"]';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "USPTO advanced search (inventor) test", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getUsptoUrl(undefined, undefined, undefined, "s. masoud");
  var expected = 'https://cors-anywhere.herokuapp.com/http://www.patentsview.org/api/patents/query?q={"_and":[{"inventor_first_name":["s. masoud"]}]}&o={"page":0,"per_page":10}&f=["patent_date","patent_title","patent_number","patent_number","inventor_first_name", "inventor_last_name","patent_type","assignee_organization","assignee_first_name","assignee_last_name","patent_kind","patent_year","cited_patent_title","cited_patent_number","patent_abstract"]';
    assert.ok( result == expected, "Passed!" );
  });

QUnit.test( "USPTO advanced search (assignee organization) test", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getUsptoUrl(undefined, undefined, undefined, undefined, undefined, "THE FLORIDA INTERNATIONAL UNIVERSITY BOARD OF TRUSTEES");
  var expected = 'https://cors-anywhere.herokuapp.com/http://www.patentsview.org/api/patents/query?q={"_and":[{"assignee_organization":["THE FLORIDA INTERNATIONAL UNIVERSITY BOARD OF TRUSTEES"]}]}&o={"page":0,"per_page":10}&f=["patent_date","patent_title","patent_number","patent_number","inventor_first_name", "inventor_last_name","patent_type","assignee_organization","assignee_first_name","assignee_last_name","patent_kind","patent_year","cited_patent_title","cited_patent_number","patent_abstract"]';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with term and location", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("Hotel","Miami");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=Hotel&location=Miami';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with term", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("Hotel","");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=Hotel';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with location", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("","Miami");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=Miami';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a blank URL if nothing is given", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("","");
    assert.ok( !result, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with term, location, & limit", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("Hotel","Miami", "50");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=Hotel&location=Miami&limit=50';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with term, & limit", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("Hotel","", "50");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=Hotel&limit=50';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with location, & limit", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("","Miami", "50");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=Miami&limit=50';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with term, location, limit, & offset", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("Hotel","Miami", "50", "99");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=Hotel&location=Miami&limit=50&offset=99';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with term, location, & offset", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("Hotel","Miami", "", "99");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=Hotel&location=Miami&offset=99';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with term, & offset", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("Hotel","", "", "99");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=Hotel&offset=99';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "getYelpURL returns a URL with location, & offset", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getYelpUrl("","Miami", "", "99");
  var expected = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=Miami&offset=99';
    assert.ok( result == expected, "Passed!" );
  });
QUnit.test( "YelpKey exists", function( assert ) {
  var uut = PatentHelper();
  var result = uut.YelpKey;
    assert.ok( result, "Passed!" );
  });
QUnit.test( "yelpModelToString returns the business name and phone number", function( assert ) {
  var uut = PatentHelper();
  var testModel= {name: 'TEST BUSINESS', phone: 'TEST NUMBER'};
  var result = uut.yelpModelToString(testModel);
    assert.ok( result == testModel.name + " - " + testModel.phone, "Passed!" );
  });
QUnit.test( "yelpModelToString returns the business name ", function( assert ) {
  var uut = PatentHelper();
  var testModel= {name: 'TEST BUSINESS'};
  var result = uut.yelpModelToString(testModel);
    assert.ok( result == testModel.name, "Passed!" );
  });
QUnit.test( "yelpModelToString returns the business phone", function( assert ) {
  var uut = PatentHelper();
  var testModel= {phone: 'TEST NUMBER'};
  var result = uut.yelpModelToString(testModel);
    assert.ok( result == testModel.phone, "Passed!" );
  });
QUnit.test( "yelpModelToString returns nothing", function( assert ) {
  var uut = PatentHelper();
  var testModel= {};
  var result = uut.yelpModelToString(testModel);
    assert.ok( !result, "Passed!" );
  });
QUnit.test( "getBusinessSearchErrorMessage returns nothing", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getBusinessSearchErrorMessage("");
    assert.ok( !result, "Passed!" );
  });
QUnit.test( "getBusinessSearchErrorMessage returns a message for yelp", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getBusinessSearchErrorMessage("yelp");
    assert.ok( result == "The yelp service is experiencing difficulties.\n Please try again later.", "Passed!" );
  });
QUnit.test( "getBusinessSearchErrorMessage returns a message for Google", function( assert ) {
  var uut = PatentHelper();
  var result = uut.getBusinessSearchErrorMessage("Google");
    assert.ok( result == "The Google service is experiencing difficulties.\n Please try again later.", "Passed!" );
  });
QUnit.test( "ustpoModelToString returns the patent title and patent number", function( assert ) {
  var uut = PatentHelper();
  var testModel= {patent_title: 'TEST PATENT', patent_number: 'TEST NUMBER'};
  var result = uut.ustpoModelToString(testModel);
    assert.ok( result == testModel.patent_title + " - " + testModel.patent_number, "Passed!" );
  });
QUnit.test( "ustpoModelToString returns the patent title ", function( assert ) {
  var uut = PatentHelper();
  var testModel= {patent_title: 'TEST PATENT'};
  var result = uut.ustpoModelToString(testModel);
    assert.ok( result == testModel.patent_title, "Passed!");
  });
QUnit.test( "ustpoModelToString returns the patent number", function( assert ) {
  var uut = PatentHelper();
  var testModel= {patent_number: 'TEST NUMBER'};
  var result = uut.ustpoModelToString(testModel);
    assert.ok( result == testModel.patent_number, "Passed!" );
  });
QUnit.test( "ustpoModelToString returns nothing", function( assert ) {
  var uut = PatentHelper();
  var testModel= {};
  var result = uut.ustpoModelToString(testModel);
    assert.ok( !result, "Passed!" );
  });
QUnit.test( "ustpoV2ModelToString returns the patent title and patent number", function( assert ) {
  var uut = PatentHelper();
  var testModel= {title: 'TEST PATENT', patentNumber: 'TEST NUMBER'};
  var result = uut.ustpoV2ModelToString(testModel);
    assert.ok( result == testModel.title + " - " + testModel.patentNumber, "Passed!" );
  });
QUnit.test( "ustpoV2ModelToString returns the patent title ", function( assert ) {
  var uut = PatentHelper();
  var testModel= {title: 'TEST PATENT'};
  var result = uut.ustpoV2ModelToString(testModel);
    assert.ok( result == testModel.title, "Passed!");
  });
QUnit.test( "ustpoV2ModelToString returns the patent number", function( assert ) {
  var uut = PatentHelper();
  var testModel= {patentNumber: 'TEST NUMBER'};
  var result = uut.ustpoV2ModelToString(testModel);
    assert.ok( result == testModel.patentNumber, "Passed!" );
  });
QUnit.test( "ustpoV2ModelToString returns nothing", function( assert ) {
  var uut = PatentHelper();
  var testModel= {};
  var result = uut.ustpoV2ModelToString(testModel);
    assert.ok( !result, "Passed!" );
  });