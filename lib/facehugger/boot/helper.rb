Application.class_eval do

  Dir["#{root}/lib/facehugger/helper/*.rb"].sort.each do |path|
    require path
  end
end