from pydoc import render_doc
from flask import Flask,render_template,url_for
from sklearn.metrics import accuracy_score, confusion_matrix,ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import matplotlib
import pickle
import seaborn as sns

app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
matplotlib.pyplot.switch_backend('Agg') 
cfm = pickle.load(open('static/models/lr-cfm.pk1', 'rb'))
df = pickle.load(open('static/models/test_df_dump.p', 'rb'))
data={}
data["made_by"]=list(df["manufacturer"].unique())
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
    print(data)
    return render_template("home.html",data=data)


@app.route('/about')
def about():

    title = "Applied Data Science - Final Project - Vehicle Price Prediction"

    pageType = 'about'

    return render_template("about.html", title=title,  pageType=pageType)


