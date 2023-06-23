﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Server_side.Models
{
    public class Country: IComparable<Country>
    {
        int id;
        string name;
        string code;
        float sum_values_of_product;
        string continent;
        int year;
        List<Point> values_per_year;

        public Country(int id, string name, string code)
        {
            this.Id = id;
            this.Name = name;
            this.Code = code;
        }

        public Country() { }

        public Country(int id, string name, string code, int year, float sum_values_of_product)
        {
            this.id = id;
            this.name = name;
            this.code = code;
            this.year = year;
            this.sum_values_of_product = sum_values_of_product;
        }

        public Country(int id, string name, string code, List<Point> values_per_year)
        {
            this.id = id;
            this.name = name;
            this.code = code;
            this.values_per_year = values_per_year;
        }

        public Country(string code, float sum_values_of_product)
        {
            this.code = code;
            this.sum_values_of_product = sum_values_of_product;
        }

        public Country(int id, string name, string code, string continent)
        {
            this.id = id;
            this.name = name;
            this.code = code;
            this.continent = continent;
        }

        public Country(string code, string name, float sum_values_of_product)
        {
            this.name = name;
            this.code = code;
            this.sum_values_of_product = sum_values_of_product;
        }

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Code { get => code; set => code = value; }
        public float Sum { get => sum_values_of_product; set => sum_values_of_product = value; }
        public int Year { get => year; set => year = value; }
        public List<Point> Values_per_year { get => values_per_year; set => values_per_year = value; }
        public string Continent { get => continent; set => continent = value; }

        // Get all countries
        public List<Country> GetAllCountries()
        {
            return DBservices.GetAllCountries();
        }

        // Get the data for the bar chart
        public List<Country> DataForBarChart(string code, string flow, int year, List<Country> countries)
        {
            return DBservices.DataForBarChart(code, flow, year, countries);
        }

        // Get the data for the line chart
        public List<Country> DataForLineChart(string category_id, string flow, List<Country> countries)
        {
            return DBservices.DataForLineChart(category_id, flow, countries);
        }

        // Get data for the geo chart
        public List<Country> DataForGeoChart(List<Product> pieChartProducts, int year, string flow)
        {
            return DBservices.DataForGeoChart(pieChartProducts, flow, year);
        }

        // Get data for the histogram chart
        public List<Country> DataForHistogramChart(string ind, string flow, int year, int countriesNumber)
        {
            return DBservices.DataForHistogramChart(ind, flow, year, countriesNumber);
        }

        public override bool Equals(object obj)
        {
            var country = obj as Country;
            return country != null &&
                   code == country.code;
        }

        public int CompareTo(Country country)
        {
            // A null value means that this object is greater.
            if (country == null)
                return 1;

            else
                return this.sum_values_of_product.CompareTo(country.sum_values_of_product);
        }

    }
}