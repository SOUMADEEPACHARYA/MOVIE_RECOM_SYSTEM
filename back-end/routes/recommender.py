import sys
import pickle
import pandas as pd
import json
import pandas as pd
import sqlalchemy
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

num_of_rec = 5
min_users =  2

def recommend_context(movie_id, num_of_rec ):
    movie_id = int(movie_id)
    index = movies_tags[movies_tags['movie_id'] == movie_id].index[0]
    distances = sorted(list(enumerate(similarity_df[index])),reverse=True,key = lambda x: x[1])
    rec_movies = []
    for i in distances[1:num_of_rec + 1]:
        movie = movies_tags.iloc[i[0]]
        rec_movies.append(str(movie.movie_id))
    return rec_movies


def similarity_score_collab(ratings, ratings_with_name, movies ):
    x = ratings_with_name.groupby('user_id').count()['rating'] #> 200
    padhe_likhe_users = x.index
    filtered_rating = ratings_with_name[ratings_with_name['user_id'].isin(padhe_likhe_users)]
    y = filtered_rating.groupby('title').count()['rating'] #>=50
    famous_movies = y.index
    final_ratings = filtered_rating[filtered_rating['title'].isin(famous_movies)]
    pt = final_ratings.pivot_table(index='title',columns='user_id',values='rating')
    pt.fillna(0,inplace=True)
    similarity_scores = cosine_similarity(pt)
    return similarity_scores, pt


def recommend_colab(movie_id, num_of_rec ):
    movie_name = movies[movies['movie_id'] == movie_id].title.iloc[0]
    z = pt.index==movie_name
    if( z.sum() == 0 ):
        return recommend_context(movie_id, num_of_rec )
    
    index = np.where(z)[0][0]
    similar_items = sorted(list(enumerate(similarity_scores[index])),key=lambda x:x[1],reverse=True)[1:1+num_of_rec]
    rec_movies = []
    for i in similar_items:
        #item = []
        temp_df = movies[movies['title'] == pt.index[i[0]]]
        #item.extend( list(temp_df.drop_duplicates('title')['title'].values) )
        #item.extend(list(temp_df.drop_duplicates('title')['movie_id'].values))
        rec_movies.append(str(temp_df.drop_duplicates('title')['movie_id'].iloc[0]))
        #item.extend(list(temp_df.drop_duplicates('title')['Image-URL-M'].values))
        #data.append(item)
    return rec_movies


# data = '{"user_id":"126", "movie_id":"155"}'
data = str(sys.argv[1])
# print(sys.argv[1],"hi")
result = json.loads(data)
#print(result)
algo = 0


engine = sqlalchemy.create_engine('mysql+pymysql://root:@localhost:3306/SSD_PROJECT')
df = pd.read_sql_table('USER_RATINGS', engine)
ratings = df.rename( columns={'USER_ID':'user_id','MOVIE_ID':'movie_id','RATING':'rating'} )
movies = pd.read_csv('/home/aditya/Documents/ssd/project/recommender-system/back-end/routes/movies_filtered.csv')[['movie_id', 'title', 'genres', 'overview', 'keywords',
       'cast', 'crew', 'poster_path']]
movies['movie_id'] = movies['movie_id'].astype(str)


movies_tags = pickle.load(  open('/home/aditya/Documents/ssd/project/recommender-system/back-end/routes/movie_list.pkl','rb')  )
similarity_df = pickle.load(open('/home/aditya/Documents/ssd/project/recommender-system/back-end/routes/similarity.pkl','rb') )

user_ratings = len(ratings[ ratings['user_id'] == result['user_id'] ])
if( user_ratings >= min_users ):
    algo = 1
    ratings_with_name = ratings.merge(movies,on='movie_id')
    similarity_scores, pt = similarity_score_collab(ratings, ratings_with_name, movies)
    rec_movies = recommend_colab(result['movie_id'],num_of_rec)
else:    
    rec_movies = recommend_context(result['movie_id'],num_of_rec)


resp = {
     "Response":"200",
     "Message":"hello From Python File ",
     "Data":rec_movies
}
print(json.dumps(resp))
sys.stdout.flush()