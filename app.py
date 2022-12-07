from pydoc import render_doc
from flask import Flask,render_template,url_for,request,jsonify
from sklearn.metrics import accuracy_score, confusion_matrix,ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import matplotlib
import pickle
import seaborn as sns

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
matplotlib.pyplot.switch_backend('Agg') 
# cfm = pickle.load(open('static/models/lr-cfm.pk1', 'rb'))
df = pickle.load(open('static/models/test_df_dump.p', 'rb'))
# make_names=[*set(list((df["manufacturer"])))]
# make_codes=[*set(list((df["make"])))]
result=""

price_range = (df['price'] >=24000) & (df['price'] <= 34000)
df_price=df.loc[price_range]
data=df.to_json(orient = 'records')
df_price_json=df_price.to_json(orient = 'records')

 
def loadcharts():
    #vehicles by region
    df_reg=df["region"][:10].value_counts().reset_index()
    df_reg.columns=["region","count"]
    plt.xticks(rotation=70)
    plt.title("Used vehicles available by region - top 10",size=15)
    ax=sns.barplot(df_reg['region'],df_reg['count'],color = 'g')
    fig=ax.get_figure()
    fig.savefig("static/images/charts/by_region.png")

    #Vehicle count vs cylinders
    df_cylider=df["cylinders"].value_counts().reset_index()
    df_cylider.columns=["cylinders","count"]
    plt.title("# of cyclinders",size=15)
    ax=sns.barplot(df_cylider['cylinders'],df_cylider['count'],color = 'b')
    fig=ax.get_figure()
    fig.savefig("static/images/charts/clynd_count.png")

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
    return render_template("home.html",data=data,data_price=df_price_json)

@app.route('/predict_results', methods=['POST'])
def process_qt_calculation():
  if request.method == "POST":
    data = request.get_json()
    print(type(data["make"]))
    
   
    df_make=df[(df['price']>1000) & (df['make'] == int(data['make']))]
    df_make_year=df_make[df_make['year'] == int(data['year'])]
    df_make_year_miles=df_make_year[df_make_year['odometer'] <= int(data['miles'])]
    price=int(df_make_year_miles['price'].mean())
    price_range = (df_make_year_miles['price'] >=(price-5000)) & (df_make_year_miles['price'] <= (price-+000))
    df_price=df_make_year_miles[price_range]
    df_result=df_price.to_json(orient = 'records')
    
  return {"predicted_price":int(df_make_year_miles['price'].mean()),"data":df_result}

@app.route('/about')
def about():

    title = "Applied Data Science - Final Project - Vehicle Price Prediction"

    pageType = 'about'

    return render_template("about.html", title=title,  pageType=pageType)


