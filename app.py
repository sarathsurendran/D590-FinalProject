from pydoc import render_doc
from flask import Flask,render_template,url_for,request,jsonify
from sklearn.metrics import accuracy_score, confusion_matrix,ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import matplotlib
import pickle
import pandas as pd
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import Lasso
from sklearn.linear_model import Ridge
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
matplotlib.pyplot.switch_backend('Agg') 
# cfm = pickle.load(open('static/models/lr-cfm.pk1', 'rb'))
df = pickle.load(open('static/models/df_vehicles.p', 'rb'))
# make_names=[*set(list((df["manufacturer"])))]
# make_codes=[*set(list((df["make"])))]
result=""
data=df.to_json(orient = 'records')

 
def loadcharts():
    # #vehicles by region
    # df_reg=df["region"].value_counts()[:10].reset_index()
    # df_reg.columns=["region","count"]
    # plt.xticks(rotation=70)
    # plt.title("Used vehicles available by region - top 10",size=15)
    # ax=sns.barplot(df_reg['region'],df_reg['count'],color = 'g')
    # fig=ax.get_figure()
    # fig.savefig("static/images/charts/by_region.png")

    #Vehicle count vs cylinders
    df_cylider=df["cylinders"].value_counts().reset_index()
    df_cylider.columns=["cylinders","count"]
    plt.title("# of cyclinders",size=50)
    ax=sns.barplot(df_cylider['cylinders'],df_cylider['count'],color = 'b')
    fig=ax.get_figure()
    fig.set_size_inches(20, 10, forward=True)
    fig.savefig("static/images/charts/clynd_count.png",dpi=100)

    #year of manufacturing
    plt.figure(figsize=(10,15))
    ax = sns.countplot(df['year'])
    plt.title("Car Model Year",size=15)
    k = ax.set_xticklabels(ax.get_xticklabels(),rotation=90,size=10)
    fig=ax.get_figure()
    fig.savefig("static/images/charts/year_count.png") 

    #paint color
    plt.figure(figsize=(8,8))
    color_df = df['paint_color'].value_counts().reset_index()
    color_df.columns = ['car color','count']
    plt.title("Color count of Cars",size=20)
    ax=sns.barplot(color_df['car color'],color_df['count'],color = 'royalblue')
    fig=ax.get_figure()
    fig.savefig('static/images/charts/paint_count.png', dpi=fig.dpi)


#Create all charts
loadcharts()


@app.route('/')
def homepage():
    return render_template("home.html",data=data)

@app.route('/predict_results', methods=['POST'])
def process_qt_calculation():
  if request.method == "POST":
    data = request.get_json()
    print(data)
    
    #retrieving all request attributes
    make=int(data["make"])
    model=int(data["model"])
    size=int(data["size"])
    condition=int(data["condition"])
    transmission=int(data["transmission"])
    drive=int(data["drive"])
    cylinders=int(data["cylinders"])
    type=int(data["type"])
    color=int(data["color"])
    year=int(data["year"])
    miles=int(data["miles"])
    regressionmodel=int(data["regressionmodel"])
    
    #preparing columns for model
    cols=[]
    df_pred_data=[]
    if(make!= -1):
        cols.append("make")
        df_pred_data.append(make)
    if(model != -1):
        cols.append("model_codes")
        df_pred_data.append(model)
    if(size != -1):
        cols.append("size_codes")
        df_pred_data.append(size)
    if(condition != -1):
        cols.append("condition_codes")
        df_pred_data.append(condition)
    if(transmission != -1):
        cols.append("transmission_codes")
        df_pred_data.append(transmission)
    if(drive != -1):
        cols.append("drive_codes")
        df_pred_data.append(drive)
    if(cylinders != -1):
        cols.append("cylinders_codes")
        df_pred_data.append(cylinders)
    if(type != -1):
        cols.append("type_codes")
        df_pred_data.append(type)
    if(color != -1):
        cols.append("paint_color_codes")
        df_pred_data.append(color)
    if(year != -1):
        cols.append("year")
        df_pred_data.append(year)
    if(miles != -1):
        cols.append("odometer")
        df_pred_data.append(miles)
    print(cols)
    
    #train and test split
    X=df[cols]
    y=df["price"]
    
    print(X.head(3))
    print(len(X))
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=50)
    
    rm=LinearRegression()
    #choose regression model
    if(regressionmodel == 2):
        rm=Lasso(alpha=0.5, normalize=True)
    elif (regressionmodel ==3):
        rm=Ridge(alpha = 0.5)
    
    rm.fit(X_train,y_train)
    y_pred=rm.predict(X_test)
    score =rm.score(X_train,y_train)
    print(score)

    
    df_pred=pd.DataFrame(columns=list(cols))
    df_pred.loc[0]=df_pred_data

    #predict price
    price=int(rm.predict(df_pred))
    
    #filter search results based on price and other attributes
    df_make=df[(df['price']>1000) & (df['make'] == int(data['make']))]
    df_make_year=df_make[df_make['year'] == int(data['year'])]
    df_make_year_miles=df_make_year[df_make_year['odometer'] <= int(data['miles'])]
    price_range = (df_make_year_miles['price'] >=(price-5000)) & (df_make_year_miles['price'] <= (price+5000))
    df_price=df_make_year_miles[price_range]
    df_result=df_price.to_json(orient = 'records')
    
  return {"predicted_price":int(price),"data":df_result}

@app.route('/about')
def about():

    title = "Applied Data Science - Final Project - Vehicle Price Prediction"

    pageType = 'about'

    return render_template("about.html", title=title,  pageType=pageType)


